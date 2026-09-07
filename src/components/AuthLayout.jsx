import { ShieldCheck } from 'lucide-react';
import './AuthLayout.css';

// A shared two-column shell for authentication screens: a navy brand
// panel on the left (hidden on small screens) and the form on the right.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <div className="auth-layout__brand-inner">
          <div className="auth-layout__logo">
            <span className="auth-layout__logo-mark">FC</span>
            <div>
              <p className="auth-layout__logo-name">FINCENTRAL BANK</p>
              <p className="auth-layout__logo-tag">Digital Banking Management System</p>
            </div>
          </div>

          <div className="auth-layout__quote">
            <p className="figure auth-layout__quote-figure">₹1,25,450.00</p>
            <p className="auth-layout__quote-text">
              A secure and smart platform for modern banking — built for people
              who expect clarity, control, and confidence over their money.
            </p>
          </div>

          <div className="auth-layout__security">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Your information is protected with bank-grade practices.</span>
          </div>
        </div>
      </div>

      <div className="auth-layout__form-side">
        <div className="auth-layout__form-wrap">
          <div className="auth-layout__mobile-logo">
            <span className="auth-layout__logo-mark auth-layout__logo-mark--sm">FC</span>
            <span className="auth-layout__mobile-name">FINCENTRAL BANK</span>
          </div>
          <h1 className="auth-layout__title">{title}</h1>
          {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
          <div className="auth-layout__body">{children}</div>
        </div>
      </div>
    </div>
  );
}
