import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './FeatureCard.css';

// Reusable clickable feature tile + section heading + responsive grid.
export function SectionHeading({ id, title, subtitle, action }) {
  return (
    <div className="section-heading">
      <div>
        <h2 className="section-heading__title" id={id}>{title}</h2>
        {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function FeatureGrid({ children, columns = 'auto' }) {
  return <div className={`feature-grid feature-grid--${columns}`}>{children}</div>;
}

export default function FeatureCard({ title, description, icon: Icon, to, cta, tone = 'blue' }) {
  return (
    <Link to={to} className="feature-card">
      <span className={`feature-card__icon feature-card__icon--${tone}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
      <span className="feature-card__cta">
        {cta} <ArrowRight size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}
