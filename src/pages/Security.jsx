import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Bell,
  BadgeCheck,
  KeyRound,
  Laptop,
  Smartphone,
  Monitor,
} from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getSecuritySettings,
  saveSecuritySettings,
  getLoginHistory,
  logSecurityEvent,
} from '../utils/security.js';
import './Security.css';

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="security-toggle-row">
      <div>
        <p className="security-toggle-row__title">{title}</p>
        <p className="security-toggle-row__description">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
        onClick={onChange}
      >
        <span className="toggle-switch__knob" />
      </button>
    </div>
  );
}

function deviceIcon(device = '') {
  if (device.includes('Android') || device.includes('iOS')) return Smartphone;
  if (device.includes('macOS') || device.includes('Windows') || device.includes('Linux')) return Laptop;
  return Monitor;
}

export default function Security() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSecuritySettings());
  const [loginHistory, setLoginHistory] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoginHistory(getLoginHistory());
  }, []);

  function handleToggle(key, label) {
    const updated = saveSecuritySettings({ [key]: !settings[key] });
    setSettings(updated);
    logSecurityEvent(`${label} turned ${updated[key] ? 'on' : 'off'}`);
    setAlert({ type: 'success', message: `${label} ${updated[key] ? 'enabled' : 'disabled'}.` });
  }

  function handleThresholdChange(e) {
    const value = Number(e.target.value) || 0;
    const updated = saveSecuritySettings({ confirmationThreshold: value });
    setSettings(updated);
  }

  return (
    <AuthenticatedLayout>
      <div className="page-fade security-page">
        <PageHeader
          title="Security"
          subtitle={
            user?.fullName
              ? `Security overview for ${user.fullName}`
              : 'Manage how your account stays protected'
          }
        />

        {alert && (
          <div className="security-alert">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} autoDismiss={3000} />
          </div>
        )}

        <div className="security-grid">
          <Card icon={ShieldCheck} title="Security Settings" subtitle="Control how your account notifies and protects you">
            <ToggleRow
              title="Login Alerts"
              description="Get an alert whenever your account is signed into on a new session."
              checked={settings.loginAlerts}
              onChange={() => handleToggle('loginAlerts', 'Login Alerts')}
            />
            <ToggleRow
              title="Transaction Confirmation"
              description="Ask for confirmation before payments above the threshold below go through."
              checked={settings.transactionConfirmation}
              onChange={() => handleToggle('transactionConfirmation', 'Transaction Confirmation')}
            />
            {settings.transactionConfirmation && (
              <div className="security-threshold">
                <label className="form-label" htmlFor="threshold">Confirmation threshold (₹)</label>
                <input
                  id="threshold"
                  type="number"
                  min="0"
                  step="500"
                  className="form-input"
                  value={settings.confirmationThreshold}
                  onChange={handleThresholdChange}
                />
              </div>
            )}
            <ToggleRow
              title="Two-Factor Prompt"
              description="Require an extra verification step for sensitive account changes."
              checked={settings.twoFactorPrompt}
              onChange={() => handleToggle('twoFactorPrompt', 'Two-Factor Prompt')}
            />
          </Card>

          <Card icon={KeyRound} title="Password" subtitle="Keep your password strong and up to date">
            <p className="security-password-copy">
              Update your password regularly and avoid reusing it across other sites.
            </p>
            <Button variant="outline" icon={KeyRound} onClick={() => navigate('/change-password')}>
              Change Password
            </Button>
          </Card>
        </div>

        <Card icon={Bell} title="Login Alerts" subtitle="Recent sign-ins to your account">
          {loginHistory.length === 0 ? (
            <p className="security-empty-copy">
              No login activity recorded yet for this browser session.
            </p>
          ) : (
            <ul className="login-history-list">
              {loginHistory.map((entry) => {
                const Icon = deviceIcon(entry.device);
                return (
                  <li key={entry.id} className="login-history-item">
                    <span className="login-history-item__icon">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div className="login-history-item__body">
                      <p className="login-history-item__device">
                        {entry.device}
                        {entry.current && <span className="login-history-item__badge">This device</span>}
                      </p>
                      <p className="login-history-item__time">
                        {new Date(entry.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <BadgeCheck size={16} className="login-history-item__check" aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
