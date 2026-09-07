import './Card.css';

// A generic surface used for balance tiles, summaries, tables, etc.
// title/subtitle are optional; action is an optional element (e.g. a Button)
// rendered in the top-right of the card header.
export default function Card({
  title,
  subtitle,
  icon: Icon,
  action,
  padded = true,
  className = '',
  children,
}) {
  return (
    <div className={`card ${className}`}>
      {(title || action || Icon) && (
        <div className="card__header">
          <div className="card__heading">
            {Icon && (
              <span className="card__icon">
                <Icon size={18} aria-hidden="true" />
              </span>
            )}
            <div>
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="card__action">{action}</div>}
        </div>
      )}
      <div className={padded ? 'card__body' : 'card__body card__body--flush'}>
        {children}
      </div>
    </div>
  );
}
