
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Bell,
  Monitor,
  Moon,
  Sun,
  CheckCircle,
} from 'lucide-react';

import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import {
  getSecuritySettings,
  saveSecuritySettings,
} from '../utils/security.js';

import './Settings.css';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('fincentral_display_preferences')
      ) || { compact: false, dark: false };
    } catch {
      return { compact: false, dark: false };
    }
  });

  const [saved, setSaved] = useState(false);

  const [security] = useState(() => getSecuritySettings());

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('fincentral_notifications_enabled') !== 'false';
  });

  function updatePreference(key, value) {
    const updated = { ...preferences, [key]: value };

    setPreferences(updated);
    localStorage.setItem(
      'fincentral_display_preferences',
      JSON.stringify(updated)
    );

    setSaved(true);
  }

  function toggleNotifications(value) {
    setNotificationsEnabled(value);

    localStorage.setItem(
      'fincentral_notifications_enabled',
      String(value)
    );

    setSaved(true);
  }

  return (
    <AuthenticatedLayout>
      <div className="page-fade settings-page">

        <div className="settings-header">
          <p className="settings-eyebrow">PREFERENCES & SECURITY</p>
          <h1>Settings</h1>
          <p>Manage your password, account security and preferences.</p>
        </div>

        {saved && (
          <div className="settings-saved">
            <CheckCircle size={17} />
            Your preferences have been saved.
            <button onClick={() => setSaved(false)}>×</button>
          </div>
        )}

        <section className="settings-section">
          <h2>Account & Security</h2>
          <p className="settings-section-subtitle">
            Keep your FINCENTRAL BANK account secure.
          </p>

          <Link to="/change-password" className="settings-option">
            <div className="settings-option-icon">
              <KeyRound size={22} />
            </div>
            <div className="settings-option-content">
              <h3>Change Password</h3>
              <p>Update your account password.</p>
            </div>
            <ChevronRight size={20} className="settings-chevron" />
          </Link>

          <Link to="/security" className="settings-option">
            <div className="settings-option-icon">
              <ShieldCheck size={22} />
            </div>
            <div className="settings-option-content">
              <h3>Security Settings</h3>
              <p>Manage login alerts and account protection.</p>
            </div>
            <ChevronRight size={20} className="settings-chevron" />
          </Link>
        </section>

        <section className="settings-section">
          <h2>Notification Preferences</h2>
          <p className="settings-section-subtitle">
            Control your banking notification preferences.
          </p>

          <div className="settings-option">
            <div className="settings-option-icon">
              <Bell size={22} />
            </div>

            <div className="settings-option-content">
              <h3>Banking Notifications</h3>
              <p>Enable or disable notifications in your account.</p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={e => toggleNotifications(e.target.checked)}
              />
              <span />
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Display Preferences</h2>
          <p className="settings-section-subtitle">
            Customize your dashboard display.
          </p>

          <div className="settings-option">
            <div className="settings-option-icon">
              {preferences.compact
                ? <Monitor size={22} />
                : <Sun size={22} />}
            </div>

            <div className="settings-option-content">
              <h3>Compact Display</h3>
              <p>Save your compact display preference.</p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={preferences.compact}
                onChange={e =>
                  updatePreference('compact', e.target.checked)
                }
              />
              <span />
            </label>
          </div>

          <div className="settings-option">
            <div className="settings-option-icon">
              {preferences.dark ? <Moon size={22} /> : <Sun size={22} />}
            </div>

            <div className="settings-option-content">
              <h3>Dark Display Preference</h3>
              <p>Save your preferred display mode.</p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={preferences.dark}
                onChange={e =>
                  updatePreference('dark', e.target.checked)
                }
              />
              <span />
            </label>
          </div>

          <p className="settings-section-subtitle">
            These preferences are saved locally. The display switches
            do not yet change the entire application theme.
          </p>
        </section>

      </div>
    </AuthenticatedLayout>
  );
}
