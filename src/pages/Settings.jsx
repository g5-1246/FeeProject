import { Link } from 'react-router-dom';
import { KeyRound, ShieldCheck, ChevronRight, Bell, Monitor } from 'lucide-react';
import './Settings.css';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <p className="settings-eyebrow">PREFERENCES & SECURITY</p>
        <h1>Settings</h1>
        <p>Manage your password, account security, and preferences.</p>
      </div>
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
            <p>Manage security preferences and account protection.</p>
          </div>
          <ChevronRight size={20} className="settings-chevron" />
        </Link>
      </section>

      <section className="settings-section">
        <h2>Preferences</h2>
        <p className="settings-section-subtitle">
          More account preferences can be added here.
        </p>

        <div className="settings-option settings-option-static">
          <div className="settings-option-icon">
            <Bell size={22} />
          </div>
          <div className="settings-option-content">
            <h3>Notifications</h3>
            <p>Manage banking and login notifications.</p>
          </div>
          <ChevronRight size={20} className="settings-chevron" />
        </div>

        <div className="settings-option settings-option-static">
          <div className="settings-option-icon">
            <Monitor size={22} />
          </div>
          <div className="settings-option-content">
            <h3>Display Preferences</h3>
            <p>Personalize your banking experience.</p>
          </div>
          <ChevronRight size={20} className="settings-chevron" />
        </div>
      </section>
    </div>
  );
}