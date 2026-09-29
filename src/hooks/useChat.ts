import { useEffect, useRef, useState } from 'react';
import { createDemoReply } from '../lib/demo';
import type { ChatState, Message, ModelId } from '../types';
import { useStoredState } from './useStoredState';

const initial: ChatState = { conversations: [], activeId: null, model: 'echo' };

export function useChat() {
  const [state, setState, storageError] = useStoredState(
    'echogpt-chat-v1',
    initial,
  );
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const active = state.conversations.find((chat) => chat.id === state.activeId);

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    busy.current = false;
    setPending(false);
  }

  function send(raw: string, compare?: ModelId, context = '') {
    const content = raw.trim();
    if (!content || busy.current) return;
    busy.current = true;
    const id = active?.id ?? crypto.randomUUID();
    const user: Message = { id: crypto.randomUUID(), role: 'user', content };
    const selectedModels =
      compare && compare !== state.model
        ? [state.model, compare]
        : [state.model];
    setState((previous) => ({
      ...previous,
      activeId: id,
      conversations: active
        ? previous.conversations.map((chat) =>
            chat.id === id
              ? {
                  ...chat,
                  updatedAt: Date.now(),
                  messages: [...chat.messages, user],
                }
              : chat,
          )
        : [
            {
              id,
              title: content.slice(0, 48),
              updatedAt: Date.now(),
              messages: [user],
            },
            ...previous.conversations,
          ],
    }));
    setPending(true);
    timer.current = setTimeout(() => {
      const replies: Message[] = selectedModels.map((model) => ({
        id: crypto.randomUUID(),
        role: 'assistant',
        model,
        content: createDemoReply(content, model, context),
      }));
      setState((previous) => ({
        ...previous,
        conversations: previous.conversations.map((chat) =>
          chat.id === id
            ? { ...chat, messages: [...chat.messages, ...replies] }
            : chat,
        ),
      }));
      busy.current = false;
      timer.current = null;
      setPending(false);
    }, 650);
  }

  return {
    ...state,
    active,
    pending,
    send,
    stop,
    storageError,
    setModel: (model: ModelId) =>
      setState((previous) => ({ ...previous, model })),
    newChat: () => {
      stop();
      setState((previous) => ({ ...previous, activeId: null }));
    },
    openChat: (activeId: string) => {
      stop();
      setState((previous) => ({ ...previous, activeId }));
    },
    deleteChat: (id: string) => {
      stop();
      setState((previous) => ({
        ...previous,
        activeId: previous.activeId === id ? null : previous.activeId,
        conversations: previous.conversations.filter((chat) => chat.id !== id),
      }));
    },
    renameChat: (id: string, title: string) =>
      setState((previous) => ({
        ...previous,
        conversations: previous.conversations.map((conversation) =>
          conversation.id === id
            ? { ...conversation, title: title.trim().slice(0, 80) }
            : conversation,
        ),
      })),
    clearHistory: () => {
      stop();
      setState((previous) => ({
        ...previous,
        conversations: [],
        activeId: null,
      }));
    },
  };
}
