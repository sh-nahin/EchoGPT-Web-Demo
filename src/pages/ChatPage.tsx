import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Columns2,
  Download,
  FileText,
  Lightbulb,
  Menu,
  Paperclip,
  PenLine,
  Sparkles,
  X,
} from 'lucide-react';
import { Brand } from '../components/Brand';
import { Composer } from '../components/Composer';
import { Dialog } from '../components/Dialog';
import { MessageList } from '../components/MessageList';
import { ModelMark, ModelPicker } from '../components/ModelPicker';
import { Sidebar } from '../components/Sidebar';
import { useChat } from '../hooks/useChat';
import { useStoredState } from '../hooks/useStoredState';
import { models, prompts } from '../data';
import type { Conversation, ModelId } from '../types';

const promptIcons = [PenLine, BookOpen, Code2, Lightbulb];
const proModelIds: ModelId[] = ['gpt', 'claude', 'gemini', 'deepseek'];
type Attachment = { name: string; text: string };

export default function ChatPage({
  theme,
  onToggleTheme,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}) {
  const chat = useChat();
  const [draft, setDraft] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<
    'prompts' | 'settings' | 'rename' | 'pro' | null
  >(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [compare, setCompare] = useState(false);
  const [compareModel, setCompareModel] = useState<ModelId>('claude');
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [title, setTitle] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [enterToSend, setEnterToSend, preferenceError] = useStoredState(
    'echogpt-enter-to-send',
    true,
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const hasMessages = Boolean(chat.active?.messages.length);

  function newChat() {
    chat.newChat();
    setDraft('');
    setAttachment(null);
    setAttachmentError('');
    setSidebarOpen(false);
  }

  function send() {
    if (
      !draft.trim() ||
      chat.pending ||
      (compare && chat.model === compareModel)
    )
      return;
    chat.send(
      draft,
      compare ? compareModel : undefined,
      attachment?.text ?? '',
    );
    setDraft('');
    setAttachment(null);
    setAttachmentError('');
  }

  function usePrompt(text: string) {
    setDraft(text);
    setModal(null);
    setSidebarOpen(false);
    setTimeout(() => document.getElementById('prompt')?.focus(), 0);
  }

  async function readAttachment(file?: File) {
    setAttachmentError('');
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setAttachmentError('Choose a .txt or .md file.');
      return;
    }
    if (file.size > 100 * 1024) {
      setAttachmentError('Choose a text file smaller than 100 KB.');
      return;
    }
    try {
      const text = (await file.text()).trim();
      if (!text) {
        setAttachmentError('This file has no text to read.');
        return;
      }
      setAttachment({ name: file.name, text: text.slice(0, 12000) });
      if (!draft.trim()) setDraft('Summarize the main points of this text.');
    } catch {
      setAttachmentError(
        'This file could not be read. Please try another text file.',
      );
    }
  }

  function exportChat() {
    if (!chat.active) return;
    const content =
      `# ${chat.active.title}\n\nFrontend demo\n\n` +
      chat.active.messages
        .map(
          (message) =>
            `## ${message.role === 'user' ? 'You' : (models.find((item) => item.id === message.model)?.name ?? 'EchoGPT')}\n\n${message.content}`,
        )
        .join('\n\n');
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/markdown' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'echogpt-chat.md';
    link.click();
    URL.revokeObjectURL(url);
  }

  function openModal(value: 'prompts' | 'settings') {
    setSidebarOpen(false);
    setModal(value);
  }

  const composer = (
    <div className="chat-composer-area">
      <div className="composer-options">
        <ModelPicker value={chat.model} onChange={chat.setModel} />
        <span className="model-caption">Choose your thinking partner</span>
        <button
          className={`text-button compare-toggle ${compare ? 'is-active' : ''}`}
          aria-label="Compare two models"
          aria-pressed={compare}
          onClick={() => setCompare(!compare)}
        >
          <Columns2 size={16} />
          <span>Compare</span>
        </button>
      </div>
      {compare && (
        <div className="compare-options">
          <span>Compare with</span>
          <label className="sr-only" htmlFor="compare-model">
            Second model
          </label>
          <select
            id="compare-model"
            value={compareModel}
            onChange={(event) => setCompareModel(event.target.value as ModelId)}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <button
            className="icon-button"
            aria-label="Close comparison"
            onClick={() => setCompare(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {compare && chat.model === compareModel && (
        <p role="status" className="notice">
          Choose a different second model to compare responses.
        </p>
      )}
      {attachment && (
        <div className="file-attachment">
          <FileText size={17} />
          <span>
            {attachment.name}
            <small>Text preview · up to 12,000 characters</small>
          </span>
          <button
            className="icon-button"
            aria-label="Remove attachment"
            onClick={() => setAttachment(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <Composer
        value={draft}
        onChange={setDraft}
        onSend={send}
        pending={chat.pending}
        onStop={chat.stop}
        enterToSend={enterToSend}
        disabled={compare && chat.model === compareModel}
        placeholder="Ask a question, share an idea, or paste some text…"
        actions={
          <>
            <button
              type="button"
              className="icon-button"
              aria-label="Attach text file"
              onClick={() => fileInput.current?.click()}
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="composer-prompt"
              onClick={() => openModal('prompts')}
            >
              <Sparkles size={15} />
              Prompts
            </button>
             <button
              type="button"
              className="try-pro"
              onClick={() => {
                setSidebarOpen(false);
                setModal('pro');
              }}
            >
              <Sparkles size={15} />
              Try Pro
            </button>
          </>
        }
      />
      <input
        ref={fileInput}
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept=".txt,.md"
        aria-label="Choose a text file"
        onChange={(event) => {
          void readAttachment(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {(attachmentError || chat.storageError || preferenceError) && (
        <p role="alert" className="notice">
          {attachmentError || chat.storageError || preferenceError}
        </p>
      )}
      <p className="composer-disclaimer">
        <Check size={12} />
        Local demo responses. Your messages stay in this browser.
      </p>
    </div>
  );

  return (
    <div className="workspace">
      <a
        className="skip-link"
        href="#chat-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('chat-main')?.focus();
        }}
      >
        Skip to conversation
      </a>
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.activeId}
        open={sidebarOpen}
        theme={theme}
        onClose={() => setSidebarOpen(false)}
        onNew={newChat}
        onSelect={(id) => {
          chat.openChat(id);
          setDraft('');
          setAttachment(null);
          setSidebarOpen(false);
        }}
        onDelete={chat.deleteChat}
        onRename={(conversation) => {
          setRenameTarget(conversation);
          setTitle(conversation.title);
          setSidebarOpen(false);
          setModal('rename');
        }}
        onPrompts={() => openModal('prompts')}
        onSettings={() => openModal('settings')}
        onToggleTheme={onToggleTheme}
      />
      <main className="chat-main" id="chat-main" tabIndex={-1}>
        <header className="chat-header">
          <div className="chat-breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Chat</span>
            <ChevronRight size={14} />
            <strong>{chat.active?.title ?? 'New chat'}</strong>
          </div>
          <div className="chat-header-actions">
            <span className="demo-pill">Demo Echogpt AI</span>
            <button
              className="icon-button"
              aria-label="Export conversation"
              onClick={exportChat}
              disabled={!hasMessages}
            >
              <Download size={18} />
            </button>
          </div>
        </header>
        {hasMessages ? (
          <>
            <div className="chat-scroll">
              <MessageList
                messages={chat.active!.messages}
                pending={chat.pending}
              />
            </div>
            {composer}
          </>
        ) : (
          <div className="start-screen">
            <div className="start-content">
              <div className="welcome-symbol">
                <Brand compact />
              </div>
              <span className="section-kicker">YOUR AI WORKSPACE</span>
              <h1>
                What are we
                <br />
                <span>working on today?</span>
              </h1>
              <p className="welcome-description">
                A question, a first draft, a fresh perspective. Start here.
              </p>
              {composer}
              <div className="suggestions-heading">
                <span>A FEW WAYS TO GET STARTED</span>
                <button
                  className="text-button"
                  onClick={() => openModal('prompts')}
                >
                  View prompts
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="welcome-prompts">
                {prompts.map((prompt, index) => {
                  const Icon = promptIcons[index];
                  return (
                    <button
                      key={prompt.category}
                      onClick={() => usePrompt(prompt.text)}
                    >
                      <span className={`prompt-icon prompt-${index}`}>
                        <Icon size={19} />
                      </span>
                      <strong>{prompt.category}</strong>
                      <p>{prompt.title}</p>
                      <ArrowUpRight className="prompt-arrow" size={15} />
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="start-bottom">A clear space for your next thought.</p>
          </div>
        )}
      </main>
      {modal === 'prompts' && (
        <Dialog title="Prompt library" onClose={() => setModal(null)}>
          <p className="muted">Choose a starting point. Make it your own.</p>
          <div className="prompt-library">
            {prompts.map((prompt) => (
              <button
                key={prompt.category}
                onClick={() => usePrompt(prompt.text)}
              >
                <span className="section-kicker">{prompt.category}</span>
                <strong>{prompt.title}</strong>
                <p>{prompt.text}</p>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
        </Dialog>
      )}
      {modal === 'pro' && (
        <Dialog title="Explore Pro models" onClose={() => setModal(null)}>
          <p className="muted">
            Choose a model for your next conversation.
          </p>
          <div className="model-list">
            {models
              .filter((model) => proModelIds.includes(model.id))
              .map((model) => (
                <button
                  key={model.id}
                  className={`model-option ${chat.model === model.id ? 'selected' : ''}`}
                  aria-pressed={chat.model === model.id}
                  onClick={() => {
                    chat.setModel(model.id);
                    setModal(null);
                  }}
                >
                  <ModelMark id={model.id} />
                  <span>
                    <strong>{model.name}</strong>
                    <small>{model.description}</small>
                  </span>
                  {chat.model === model.id && <Check size={18} />}
                </button>
              ))}
          </div>
          <p className="fine-print">
            Demo catalog · Responses are prepared examples.
          </p>
        </Dialog>
      )}
      {modal === 'rename' && renameTarget && (
        <Dialog title="Rename conversation" onClose={() => setModal(null)}>
          <form
            className="rename-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim()) {
                chat.renameChat(renameTarget.id, title);
                setModal(null);
              }
            }}
          >
            <label htmlFor="conversation-title">Conversation name</label>
            <input
              id="conversation-title"
              autoFocus
              maxLength={80}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <div className="inline-actions">
              <button
                className="button button-primary"
                type="submit"
                disabled={!title.trim()}
              >
                Save name
              </button>
              <button
                className="button button-outline"
                type="button"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}
      {modal === 'settings' && (
        <Dialog
          title="Settings"
          onClose={() => {
            setModal(null);
            setConfirmClear(false);
          }}
        >
          <div className="setting-row">
            <div>
              <strong>Appearance</strong>
              <p>Choose a light or dark workspace.</p>
            </div>
            <button className="button button-outline" onClick={onToggleTheme}>
              {theme === 'light' ? 'Use dark mode' : 'Use light mode'}
            </button>
          </div>
          <label className="setting-row">
            <div>
              <strong>Send with Enter</strong>
              <p>Shift + Enter always adds a new line.</p>
            </div>
            <input
              type="checkbox"
              className="toggle"
              role="switch"
              checked={enterToSend}
              onChange={(event) => setEnterToSend(event.target.checked)}
            />
          </label>
          <div className="setting-row">
            <div>
              <strong>Saved conversations</strong>
              <p>{chat.conversations.length} chats on this device.</p>
            </div>
            <button
              className="text-button danger"
              disabled={!chat.conversations.length}
              onClick={() => setConfirmClear(true)}
            >
              Clear history
            </button>
          </div>
          {confirmClear && (
            <div className="notice">
              <p>Delete all saved conversations? This cannot be undone.</p>
              <div className="inline-actions">
                <button
                  className="button button-danger"
                  onClick={() => {
                    chat.clearHistory();
                    setConfirmClear(false);
                  }}
                >
                  Delete all conversations
                </button>
                <button
                  className="button button-outline"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <p className="fine-print">
            Frontend demo: responses are prepared examples. No sign-in or AI API
            connection is required.
          </p>
        </Dialog>
      )}
    </div>
  );
}
