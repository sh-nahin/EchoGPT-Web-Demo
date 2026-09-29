import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  Cable,
  History,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Share2,
  Settings,
  Sun,
  Trash2,
  X,
} from 'lucide-react';
import { Brand } from './Brand';
import type { Conversation } from '../types';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  open: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (conversation: Conversation) => void;
  onPrompts: () => void;
  onSettings: () => void;
  onToggleTheme: () => void;
}

export function Sidebar(props: Props) {
  const [query, setQuery] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [mobile, setMobile] = useState(
    () => window.matchMedia('(max-width: 760px)').matches,
  );
  const drawer = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const conversations = props.conversations.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  async function shareApp() {
    const shareData = {
      title: 'EchoGPT',
      text: 'Take a look at EchoGPT.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setShareStatus('Link copied');
      } else {
        setShareStatus('Sharing is unavailable in this browser');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShareStatus('Could not share this link');
    }
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!mobile) return;
    if (props.open) drawer.current?.showModal();
    else drawer.current?.close();
  }, [mobile, props.open]);

  const content = (
    <>
      <div className="sidebar-brand">
        <Brand />
        <button
          className="icon-button mobile-menu"
          aria-label="Close navigation"
          onClick={props.onClose}
        >
          <X size={19} />
        </button>
      </div>
      <button className="button button-primary new-chat" onClick={props.onNew}>
        <Plus size={18} />
        New chat<span className="key-hint">＋</span>
      </button>
      <nav className="sidebar-nav" aria-label="Chat navigation">
        <button className="sidebar-link current" onClick={props.onClose}>
          <MessageSquare size={18} />
          Chat
          <span className="nav-marker" />
        </button>
        <button className="sidebar-link" onClick={props.onPrompts}>
          <BookOpen size={18} />
          Prompt library
        </button>
        <button
          className="sidebar-link"
          onClick={() => search.current?.focus()}
        >
          <History size={18} />
          History
        </button>
        <button
          className="sidebar-link"
          onClick={() => search.current?.focus()}
        >
          <Cable size={18} />
          Connector
        </button>
        <button
          className="sidebar-link"
          onClick={() => search.current?.focus()}
        >
          <BriefcaseBusiness size={18} />
          Ai Job Analysis
        </button>
      </nav>
      <div className="sidebar-section-title">
        <span>RECENT CONVERSATIONS</span>
        <span>{props.conversations.length}</span>
      </div>
      <label className="search-field sidebar-search">
        <Search size={16} />
        <input
          ref={search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your chats"
          aria-label="Search conversations"
        />
      </label>
      <div className="history-list">
        {conversations.map((item) => (
          <div
            key={item.id}
            className={`history-row ${item.id === props.activeId ? 'active' : ''}`}
          >
            <button
              className="history-title"
              onClick={() => props.onSelect(item.id)}
            >
              <MessageSquare size={15} />
              <span>{item.title}</span>
            </button>
            <button
              className="icon-button"
              aria-label={`Rename ${item.title}`}
              onClick={() => props.onRename(item)}
            >
              <Pencil size={13} />
            </button>
            <button
              className="icon-button"
              aria-label={`Delete ${item.title}`}
              onClick={() => props.onDelete(item.id)}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {!conversations.length && (
          <div className="history-empty">
            <MessageSquare size={20} />
            <p>
              {query
                ? 'No chats match your search.'
                : 'Your conversations will appear here.'}
            </p>
          </div>
        )}
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-tools" aria-label="Workspace tools">
          <button
            className="sidebar-tool"
            aria-label="Share EchoGPT"
            title="Share EchoGPT"
            onClick={() => void shareApp()}
          >
            <Share2 size={20} />
          </button>
          <button
            className="sidebar-tool"
            aria-label="Settings"
            title="Settings"
            onClick={props.onSettings}
          >
            <Settings size={21} />
          </button>
          <button
            className="sidebar-tool"
            aria-label="Toggle light and dark mode"
            title="Toggle light and dark mode"
            onClick={props.onToggleTheme}
          >
            <Sun size={20} />
          </button>
        </div>
        {shareStatus && (
          <p className="sidebar-share-status" role="status">
            {shareStatus}
          </p>
        )}
        <div className="local-profile">
          <span>S</span>
          <div>
            Safayet Hossain Nahin<small>Saved on this device</small>
          </div>
          <span className="local-badge">Account</span>
        </div>
      </div>
    </>
  );

  return mobile ? (
    <dialog
      ref={drawer}
      className="app-sidebar sidebar-drawer"
      aria-label="Chat navigation"
      onCancel={props.onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX > bounds.right) props.onClose();
        }
      }}
    >
      {content}
    </dialog>
  ) : (
    <aside className="app-sidebar">{content}</aside>
  );
}
