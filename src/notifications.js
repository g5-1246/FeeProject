// Demo-only notifications helpers. Rather than inventing a separate fake feed,
// this builds "Transaction Alerts" and "Payment Notifications" from the same
// localStorage data the Statement/BillPayments pages already write to, so the
// Notifications page reflects real activity in the app.

import { getSecurityEvents } from './security.js';

const READ_KEY = 'fincentral_notifications_read';
const SYSTEM_KEY = 'fincentral_system_notifications';
function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
const SEED_SYSTEM_NOTIFICATIONS = [
  {
    id: 'sys-1',
    title: 'Welcome to FINCENTRAL BANK',
    message: 'Explore your dashboard, cards, and statements from one place.',
    timestamp: '2026-08-20T09:00:00.000Z',
  },
  {
    id: 'sys-2',
    title: 'Scheduled maintenance',
    message: 'Net banking services will be briefly unavailable on Sunday, 2–3 AM IST.',
    timestamp: '2026-08-25T09:00:00.000Z',
  },
  {
    id: 'sys-3',
    title: 'New: Bill Payments',
    message: 'You can now pay electricity, mobile, and internet bills directly from your account.',
    timestamp: '2026-09-02T09:00:00.000Z',
  },
];

function ensureSystemNotifications() {
  const raw = localStorage.getItem(SYSTEM_KEY);

  if (!raw) {
    localStorage.setItem(
      SYSTEM_KEY,
      JSON.stringify(SEED_SYSTEM_NOTIFICATIONS)
    );

    return SEED_SYSTEM_NOTIFICATIONS;
  }

  try {
    const saved = JSON.parse(raw);

    if (!Array.isArray(saved)) {
      throw new Error('Invalid notification data');
    }

    return saved;
  } catch {
    localStorage.setItem(
      SYSTEM_KEY,
      JSON.stringify(SEED_SYSTEM_NOTIFICATIONS)
    );

    return SEED_SYSTEM_NOTIFICATIONS;
  }
}

function getReadIds() {
  return readLocalArray(READ_KEY);
}

function saveReadIds(ids) {
  localStorage.setItem(READ_KEY, JSON.stringify(ids));
}

function safeDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function transactionAlerts() {
  const transactions = readLocalArray('fincentral_transactions');

  return transactions.map((t) => {
    const isCredit = (t.type || '').toLowerCase() === 'credit';
    const label = t.description || t.name || 'Transaction';
    const amount = Number(t.amount) || 0;

    return {
      id: `txn-${t.id}`,
      category: 'transaction',
      title: isCredit ? 'Money Credited' : 'Money Debited',
      message: `₹${amount.toLocaleString('en-IN')} ${
        isCredit ? 'credited to' : 'debited from'
      } your account for ${label}.`,
      timestamp: safeDate(t.date).toISOString(),
    };
  });
}

function paymentNotifications() {
  const history = readLocalArray('fincentral_bill_history');

  return history.map((p) => ({
    id: `bill-${p.id}`,
    category: 'payment',
    title: `${p.service} Bill Paid`,
    message: `Your ${String(p.service || 'Bill').toLowerCase()} payment of ₹${(
      Number(p.amount) || 0
    ).toLocaleString('en-IN')} was ${String(
      p.status || 'successful'
    ).toLowerCase()}.`,
    timestamp: safeDate(p.date).toISOString(),
  }));
}


function securityAlerts() {
  return getSecurityEvents().map((e) => ({
    id: `sec-${e.id}`,
    category: 'security',
    title: 'Security Alert',
    message: e.message,
    timestamp: e.timestamp,
  }));
}

function systemNotifications() {
  return ensureSystemNotifications().map((n) => ({ ...n, category: 'system' }));
}

export function getAllNotifications() {
  if (localStorage.getItem('fincentral_notifications_enabled') === 'false') {
    return [];
  }

  const readIds = getReadIds();

  const all = [
    ...transactionAlerts(),
    ...paymentNotifications(),
    ...securityAlerts(),
    ...systemNotifications(),
  ];

  return all
    .map((n) => ({
      ...n,
      read: readIds.includes(n.id),
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );
}

export function getUnreadCount() {
  return getAllNotifications().filter((n) => !n.read).length;
}

export function markAsRead(id) {
  const readIds = getReadIds();
  if (!readIds.includes(id)) {
    saveReadIds([...readIds, id]);
  }
}

export function markAllAsRead() {
  const ids = getAllNotifications().map((n) => n.id);
  saveReadIds(ids);
}
