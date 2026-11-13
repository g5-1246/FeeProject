// Demo-only security helpers (Login Alerts, Security Settings, Security Events).
// Mirrors the pattern already used in auth.js / BillPayments.jsx: everything is
// stored in localStorage since this is a frontend-only college project.

const SETTINGS_KEY = 'fincentral_security_settings';
const LOGIN_HISTORY_KEY = 'fincentral_login_history';
const EVENTS_KEY = 'fincentral_security_events';
const SESSION_FLAG_KEY = 'fincentral_session_logged';

const DEFAULT_SETTINGS = {
  loginAlerts: true,
  transactionConfirmation: true,
  confirmationThreshold: 10000,
  twoFactorPrompt: false,
};

export function getSecuritySettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
}

export function saveSecuritySettings(updates) {
  const merged = { ...getSecuritySettings(), ...updates };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}

function detectDevice() {
  const ua = navigator.userAgent || '';
  let browser = 'Unknown browser';
  if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Unknown device';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

export function getLoginHistory() {
  const raw = localStorage.getItem(LOGIN_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getSecurityEvents() {
  const raw = localStorage.getItem(EVENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function logSecurityEvent(message) {
  const events = getSecurityEvents();
  const entry = { id: Date.now(), message, timestamp: new Date().toISOString() };
  const updated = [entry, ...events].slice(0, 50);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
  return entry;
}

// Records one login-history entry per browser session (tab lifetime), so the
// Login Alerts list has real data without touching the existing Login page.
export function recordLoginIfNew(email) {
  if (!email) return;
  const flag = sessionStorage.getItem(SESSION_FLAG_KEY);
  if (flag === email) return;

  const entry = {
    id: Date.now(),
    email,
    device: detectDevice(),
    timestamp: new Date().toISOString(),
    current: true,
  };

  const history = getLoginHistory().map((h) => ({ ...h, current: false }));
  const updated = [entry, ...history].slice(0, 20);
  localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(updated));
  sessionStorage.setItem(SESSION_FLAG_KEY, email);

  if (getSecuritySettings().loginAlerts) {
    logSecurityEvent(`New login detected — ${entry.device}`);
  }
}
