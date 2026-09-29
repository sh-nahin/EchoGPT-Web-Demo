export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {!compact && (
        <span>
          Echo<span className="brand-weight">GPT</span>
        </span>
      )}
    </span>
  );
}
