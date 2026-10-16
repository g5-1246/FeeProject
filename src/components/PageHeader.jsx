import './PageHeader.css';

// Shared header for interior pages — title, optional subtitle, and an
// optional right-aligned action (usually a Button). Keeps Transfer,
// Beneficiaries, QR, Settings, and Transactions visually identical.
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header-bar">
      <div>
        <h1 className="page-header-bar__title">{title}</h1>
        {subtitle && <p className="page-header-bar__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header-bar__action">{action}</div>}
    </div>
  );
}
