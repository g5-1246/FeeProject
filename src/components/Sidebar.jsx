import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  User,
  CreditCard,
  ArrowLeftRight,
  Receipt,
  FileText,
  Settings,
  KeyRound,
  LogOut,
  X,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid, active: true },
  { label: 'Profile', to: '/profile', icon: User, active: true },
  { label: 'Account Details', to: '/account-details', icon: CreditCard, active: true },
  { label: 'Transactions', to: '/dashboard', icon: Receipt, active: false },
  { label: 'Transfer Money', to: '/dashboard', icon: ArrowLeftRight, active: false },
  { label: 'Payments', to: '/dashboard', icon: FileText, active: false },
  { label: 'Settings', to: '/profile', icon: Settings, active: false },
  { label: 'Change Password', to: '/change-password', icon: KeyRound, active: true },
];

export default function Sidebar({ isOpen, onClose, onLogoutClick }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__brand">
          <div className="sidebar__logo">FC</div>
          <div>
            <p className="sidebar__brand-name">FINCENTRAL</p>
            <p className="sidebar__brand-sub">BANK</p>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ label, to, icon: Icon, active }) => (
            <NavLink
              key={label}
              to={active ? to : '#'}
              onClick={(e) => {
                if (!active) e.preventDefault();
                if (onClose) onClose();
              }}
              className={({ isActive }) =>
                `sidebar__link ${isActive && active ? 'sidebar__link--active' : ''} ${
                  !active ? 'sidebar__link--disabled' : ''
                }`
              }
              end
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
              {!active && <span className="sidebar__badge">Soon</span>}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={onLogoutClick}>
          <LogOut size={18} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
