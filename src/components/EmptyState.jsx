import './EmptyState.css';

// A calm, on-brand empty state. Used wherever a list has no data yet —
// no beneficiaries added, no transactions in range, etc. — instead of a
// blank card or a raw "no data" string.
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state__icon">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
