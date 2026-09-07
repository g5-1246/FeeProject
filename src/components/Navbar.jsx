import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, User, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

export default function Navbar({ onMenuClick, onLogoutClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'FC';

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="navbar__search">
          <Search size={16} className="navbar__search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search transactions, payees…"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="navbar__dot" aria-hidden="true" />
        </button>

        <div className="navbar__profile" ref={dropdownRef}>
          <button
            className="navbar__profile-btn"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span className="navbar__avatar">{initials}</span>
            <span className="navbar__username">{user?.fullName?.split(' ')[0] || 'Account'}</span>
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
