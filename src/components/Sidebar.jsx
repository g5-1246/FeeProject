
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  User,
  Wallet,
  Receipt,
  Send,
  Landmark,
  CreditCard,
  FileText,
  Zap,
  Coins,
  Bell,
  Settings,
  ShieldCheck,
  ArrowLeftRight,
  LogOut,
  X,
  HandCoins,
  Sparkles,
} from 'lucide-react';
import './Sidebar.css';

// `also` lists extra path prefixes that should keep the item highlighted.
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Account Details', to: '/account-details', icon: Wallet },
  { label: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  {
    label: 'Pay & Transfer',
    to: '/pay-transfer',
    icon: Send,
    also: ['/pay-transfer', '/beneficiaries', '/transfer-history'],
  },
  {
    label: 'Deposits',
    to: '/deposits',
    icon: Landmark,
    also: ['/deposits'],
  },
  { label: 'Loans', to: '/loans', icon: HandCoins, also: ['/loans'] },
  {
    label: 'Lifestyle',
    to: '/lifestyle',
    icon: Sparkles,
    also: ['/lifestyle'],
  },
  { label: 'Payments', to: '/payments', icon: Zap },
  { label: 'Cards', to: '/cards', icon: CreditCard },
  { label: 'Bank Statement', to: '/statement', icon: FileText },
  { label: 'Bill Payments', to: '/bill-payments', icon: Receipt },
  { label: 'Currency Converter', to: '/currency-converter', icon: Coins },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Admin Panel', to: '/admin', icon: ShieldCheck },
];

export default function Sidebar({ isOpen, onClose, onLogoutClick }) {
  const { pathname } = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar__brand">
          <div className="sidebar__logo">FC</div>

          <div>
            <p className="sidebar__brand-name">FINCENTRAL</p>
            <p className="sidebar__brand-sub">BANK</p>
          </div>

          <button
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ label, to, icon: Icon, also }) => {
            const forced = also?.some((path) =>
              pathname.startsWith(path)
            );

            return (
              <NavLink
                key={label}
                to={to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `sidebar__link ${
                    isActive || forced
                      ? 'sidebar__link--active'
                      : ''
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          className="sidebar__logout"
          onClick={onLogoutClick}
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
