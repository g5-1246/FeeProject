import { useEffect, useState } from 'react';
import {
  Bell,
  ArrowLeftRight,
  Receipt,
  ShieldAlert,
  Megaphone,
  CheckCheck,
} from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
} from '../utils/notifications.js';
import './Notifications.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'transaction', label: 'Transaction Alerts' },
  { key: 'payment', label: 'Payment Notifications' },
  { key: 'security', label: 'Security Alerts' },
  { key: 'system', label: 'System / Promotional' },
];

const CATEGORY_META = {
  transaction: { icon: ArrowLeftRight, className: 'notif-icon--transaction' },
  payment: { icon: Receipt, className: 'notif-icon--payment' },
  security: { icon: ShieldAlert, className: 'notif-icon--security' },
  system: { icon: Megaphone, className: 'notif-icon--system' },
};

function timeAgo(isoDate) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setNotifications(getAllNotifications());
  }, []);

  function handleOpen(id) {
    markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function handleMarkAllRead() {
    markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filtered =
    activeFilter === 'all' ? notifications : notifications.filter((n) => n.category === activeFilter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthenticatedLayout>
      <div className="page-fade notifications-page">
        <PageHeader
          title="Notifications"
          subtitle={
            user?.fullName
              ? `Stay on top of ${user.fullName.split(' ')[0]}'s account activity`
              : 'Stay on top of your account activity'
          }
          action={
            <Button variant="outline" icon={CheckCheck} onClick={handleMarkAllRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          }
        />

        <div className="notifications-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`notif-filter ${activeFilter === f.key ? 'notif-filter--active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
              type="button"
            >
              {f.label}
              {f.key === 'all' && unreadCount > 0 && (
                <span className="notif-filter__count">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <Card padded={false}>
          {filtered.length === 0 ? (
            <div className="notifications-empty">
              <EmptyState
                icon={Bell}
                title="No notifications here"
                description="You're all caught up — new activity will show up in this list."
              />
            </div>
          ) : (
            <ul className="notifications-list">
              {filtered.map((n) => {
                const meta = CATEGORY_META[n.category] || CATEGORY_META.system;
                const Icon = meta.icon;
                return (
                  <li
                    key={n.id}
                    className={`notification-item ${n.read ? '' : 'notification-item--unread'}`}
                    onClick={() => handleOpen(n.id)}
                  >
                    <span className={`notif-icon ${meta.className}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div className="notification-item__body">
                      <p className="notification-item__title">{n.title}</p>
                      <p className="notification-item__message">{n.message}</p>
                    </div>
                    <div className="notification-item__meta">
                      <span className="notification-item__time">{timeAgo(n.timestamp)}</span>
                      {!n.read && <span className="notification-item__dot" aria-hidden="true" />}
                    </div>
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
