import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { models } from '../data';
import type { ModelId } from '../types';
import { Dialog } from './Dialog';

export function ModelMark({ id }: { id: ModelId }) {
  const model = models.find((item) => item.id === id) ?? models[0];
  return (
    <span aria-hidden="true" className={`model-mark ${model.color}`}>
      {model.mark}
    </span>
  );
}

export function ModelPicker({
  value,
  onChange,
}: {
  value: ModelId;
  onChange: (id: ModelId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const model = models.find((item) => item.id === value) ?? models[0];
  const filtered = models.filter((item) =>
    `${item.name} ${item.provider}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <button
        className="model-picker"
        onClick={() => {
          setQuery('');
          setOpen(true);
        }}
        aria-haspopup="dialog"
      >
        <ModelMark id={value} />
        {model.name}
        <ChevronDown size={15} />
      </button>
      {open && (
        <Dialog title="Choose your model" onClose={() => setOpen(false)}>
          <p className="muted">
            Find the right starting point for your next conversation.
          </p>
          <label className="search-field">
            <Search size={17} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search models or providers"
              aria-label="Search models"
            />
          </label>
          <div className="model-list">
            {filtered.map((item) => (
              <button
                key={item.id}
                className={`model-option ${value === item.id ? 'selected' : ''}`}
                aria-pressed={value === item.id}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                <ModelMark id={item.id} />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </span>
                {value === item.id && <Check size={18} />}
              </button>
            ))}
            {!filtered.length && (
              <p className="empty-note">No models match “{query}”.</p>
            )}
          </div>
          <p className="fine-print">
            Demo catalog · Responses are prepared examples.
          </p>
        </Dialog>
      )}
    </>
  );
}
