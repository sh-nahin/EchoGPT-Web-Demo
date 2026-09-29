import type { KeyboardEvent, ReactNode } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  onStop: () => void;
  enterToSend?: boolean;
  placeholder?: string;
  actions?: ReactNode;
  disabled?: boolean;
}

export function Composer({
  value,
  onChange,
  onSend,
  pending,
  onStop,
  enterToSend = true,
  actions,
  disabled = false,
  placeholder = 'Ask a question, or start with an idea…',
}: Props) {
  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      (enterToSend || event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      if (!pending && !disabled && value.trim()) onSend();
    }
  }
  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (!pending && !disabled && value.trim()) onSend();
      }}
    >
      <label className="sr-only" htmlFor="prompt">
        Your message
      </label>
      <textarea
        id="prompt"
        rows={3}
        maxLength={8000}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKey}
      />
      <div className="composer-bottom">
        <div className="composer-left">
          {actions}
          <span className="composer-hint">
            {enterToSend
              ? 'Shift + Enter for a new line'
              : 'Ctrl / ⌘ + Enter to send'}
          </span>
        </div>
        {pending ? (
          <button
            type="button"
            className="send-button"
            onClick={onStop}
            aria-label="Stop response"
          >
            <Square size={17} />
          </button>
        ) : (
          <button
            type="submit"
            className="send-button"
            disabled={disabled || !value.trim()}
            aria-label="Send message"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </form>
  );
}
