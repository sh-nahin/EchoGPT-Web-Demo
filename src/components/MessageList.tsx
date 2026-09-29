import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { models } from '../data';
import type { Message } from '../types';
import { ModelMark } from './ModelPicker';

export function MessageList({
  messages,
  pending,
}: {
  messages: Message[];
  pending: boolean;
}) {
  const end = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [messages, pending]);
  async function copy(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(message.id);
      setError('');
    } catch {
      setError(
        'Copy is unavailable. You can select and copy the response text.',
      );
    }
  }
  const groups = messages.reduce<Message[][]>((result, message) => {
    const previous = result.at(-1);
    if (message.role === 'assistant' && previous?.[0].role === 'assistant')
      previous.push(message);
    else result.push([message]);
    return result;
  }, []);
  return (
    <div
      className="messages"
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      aria-relevant="additions"
    >
      {groups.map((group) => (
        <div
          key={group[0].id}
          className={group.length > 1 ? 'assistant-group' : undefined}
        >
          {group.map((message) => (
            <article key={message.id} className={`message ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="message-author">
                  <ModelMark id={message.model ?? 'echo'} />
                  <strong>
                    {models.find((item) => item.id === message.model)?.name ??
                      'EchoGPT'}
                  </strong>
                  <span className="demo-label">Demo</span>
                </div>
              )}
              <p>{message.content}</p>
              {message.role === 'assistant' && (
                <button
                  className="text-button copy-button"
                  onClick={() => void copy(message)}
                  aria-label="Copy response"
                >
                  {copied === message.id ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied === message.id ? 'Copied' : 'Copy'}
                </button>
              )}
            </article>
          ))}
        </div>
      ))}
      {pending && (
        <div className="thinking" role="status">
          <span />
          <span />
          <span />
          <span className="sr-only">Preparing demo response</span>
        </div>
      )}
      {error && (
        <p role="status" className="notice">
          {error}
        </p>
      )}
      <div ref={end} />
    </div>
  );
}
