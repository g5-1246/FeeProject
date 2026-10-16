import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, User, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getUnreadCount } from '../utils/notifications.js';
import { getBeneficiaries } from '../utils/bankData.js';
import './Navbar.css';

export default function Navbar({ onMenuClick, onLogoutClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const unread = getUnreadCount();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    function closeSearch(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', closeSearch);
    return () => document.removeEventListener('mousedown', closeSearch);
  }, []);

  // Results are computed on demand from existing localStorage data.
  const query = search.trim().toLowerCase();
  const results = [];
  if (query) {
    JSON.parse(localStorage.getItem('fincentral_transactions') || '[]')
      .filter((t) => (t.name || t.description || '').toLowerCase().includes(query))
      .slice(0, 4)
      .forEach((t) =>
        results.push({ key: `t${t.id}`, label: t.name || t.description, kind: 'Transaction', to: '/transactions' })
      );
    getBeneficiaries()
      .filter((b) => b.name.toLowerCase().includes(query) || (b.nickname || '').toLowerCase().includes(query))
      .slice(0, 4)
      .forEach((b) =>
        results.push({ key: `b${b.id}`, label: b.name, kind: 'Payee', to: '/beneficiaries' })
      );
  }

  function goTo(to) {
    setSearchOpen(false);
    setSearch('');
    navigate(to);
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'FC';

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="navbar__search" ref={searchRef}>
          <Search size={16} className="navbar__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search transactions, payees…"
            aria-label="Search transactions and payees"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchOpen(false);
              if (e.key === 'Enter' && results[0]) goTo(results[0].to);
            }}
          />
          {searchOpen && query && (
            <div className="navbar__results" role="listbox">
              {results.length === 0 ? (
                <p className="navbar__results-empty">No matching transactions or payees.</p>
              ) : (
                results.map((r) => (
                  <button key={r.key} role="option" onClick={() => goTo(r.to)}>
                    <span>{r.label}</span>
                    <em>{r.kind}</em>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar__right">
        <button
          className="navbar__icon-btn"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          onClick={() => navigate('/notifications')}
        >
          <Bell size={19} />
          {unread > 0 && (
            <span className="navbar__badge" aria-hidden="true">{unread > 9 ? '9+' : unread}</span>
          )}
        </button>

        <div className="navbar__profile" ref={dropdownRef}>
          <button
            className="navbar__profile-btn"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span className="navbar__avatar">{initials}</span>
            <span className="navbar__username">{user?.fullName || 'Account'}</span>
            <ChevronDown size={15} />
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown" role="menu">
              <button
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
              >
                <User size={16} /> Profile
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/change-password');
                }}
              >
                <KeyRound size={16} /> Change Password
              </button>
              <div className="navbar__dropdown-divider" />
              <button
                role="menuitem"
                className="navbar__dropdown-danger"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogoutClick();
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
