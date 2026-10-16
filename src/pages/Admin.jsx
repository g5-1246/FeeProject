import { useMemo, useState } from 'react';
import {
  Users,
  Landmark,
  Receipt,
  LayoutDashboard,
  Search,
  ShieldCheck,
  ShieldBan,
  LockKeyhole,
  ChevronRight,
} from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getUsers, updateUser } from '../utils/auth.js';
import { formatDate, maskAccountNumber } from '../utils/format.js';
import './Admin.css';

const TABS = [
  { key: 'overview', label: 'Dashboard Statistics', icon: LayoutDashboard },
  { key: 'users', label: 'Manage Users', icon: Users },
  { key: 'accounts', label: 'View Accounts', icon: Landmark },
  { key: 'transactions', label: 'Monitor Transactions', icon: Receipt },
];

function getStoredTransactions() {
  return JSON.parse(localStorage.getItem('fincentral_transactions') || '[]');
}

function getStoredBillHistory() {
  return JSON.parse(localStorage.getItem('fincentral_bill_history') || '[]');
}

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(() => getUsers());

  const transactions = useMemo(() => getStoredTransactions(), []);
  const billHistory = useMemo(() => getStoredBillHistory(), []);

  const activeUsers = users.filter((u) => (u.accountStatus || 'Active') === 'Active');
  const suspendedUsers = users.length - activeUsers.length;

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  function toggleStatus(email, currentStatus) {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateUser(email, { accountStatus: nextStatus });
    setUsers(getUsers());
  }

  const combinedActivity = useMemo(() => {
    const fromTxns = transactions.map((t) => ({
      id: `txn-${t.id}`,
      description: t.description || t.name || 'Transaction',
      type: t.type || 'Debit',
      amount: Number(t.amount) || 0,
      date: t.date,
    }));
    const fromBills = billHistory.map((p) => ({
      id: `bill-${p.id}`,
      description: `${p.service} Bill Payment`,
      type: 'Debit',
      amount: Number(p.amount) || 0,
      date: p.date,
    }));
    return [...fromTxns, ...fromBills].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, billHistory]);

  const maxCount = Math.max(activeUsers.length, suspendedUsers, 1);

  return (
    <AuthenticatedLayout>
     
<div className="page-fade admin-page">
  <header className="admin-heading">
    <div>
      <p className="admin-eyebrow">FINCENTRAL BANK / CONTROL CENTRE</p>
      <h1>Administration</h1>
      <p className="admin-heading__subtitle">
        Manage customers, accounts and banking activity.
      </p>
    </div>

    <div className="admin-identity">
      <span className="admin-identity__icon">
        <LockKeyhole size={18} />
      </span>
      <div>
        <span>Administrator</span>
        <strong>{user?.fullName || 'Admin User'}</strong>
      </div>
    </div>
  </header>

  <div className="admin-layout">
    <aside className="admin-sidebar">
      <p className="admin-sidebar__label">MANAGEMENT</p>

      <nav className="admin-nav" aria-label="Admin sections">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`admin-tab ${
              tab === key ? 'admin-tab--active' : ''
            }`}
            onClick={() => setTab(key)}
            aria-current={tab === key ? 'page' : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
            {tab === key && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <ShieldCheck size={18} />
        <div>
          <strong>Secure workspace</strong>
          <span>Admin access area</span>
        </div>
      </div>
    </aside>

    <main className="admin-content">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">WORKSPACE</p>
          <h2>
            {TABS.find((item) => item.key === tab)?.label}
          </h2>
        </div>
        <span className="admin-section-badge">DEMO ENVIRONMENT</span>
      </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="admin-stat-grid">
              <Card className="admin-stat-card">
                <span className="admin-stat-card__label">Total Users</span>
                <h2 className="admin-stat-card__value">{users.length}</h2>
              </Card>
              <Card className="admin-stat-card">
                <span className="admin-stat-card__label">Active Accounts</span>
                <h2 className="admin-stat-card__value admin-stat-card__value--green">{activeUsers.length}</h2>
              </Card>
              <Card className="admin-stat-card">
                <span className="admin-stat-card__label">Suspended Accounts</span>
                <h2 className="admin-stat-card__value admin-stat-card__value--red">{suspendedUsers}</h2>
              </Card>
              <Card className="admin-stat-card">
                <span className="admin-stat-card__label">Total Transactions</span>
                <h2 className="admin-stat-card__value">{combinedActivity.length}</h2>
              </Card>
            </div>

            <Card title="Account Status Breakdown" subtitle="Active vs suspended accounts">
              <div className="admin-bar-row">
                <span className="admin-bar-row__label">Active</span>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill admin-bar-fill--green"
                    style={{ width: `${(activeUsers.length / maxCount) * 100}%` }}
                  />
                </div>
                <span className="admin-bar-row__count">{activeUsers.length}</span>
              </div>
              <div className="admin-bar-row">
                <span className="admin-bar-row__label">Suspended</span>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill admin-bar-fill--red"
                    style={{ width: `${(suspendedUsers / maxCount) * 100}%` }}
                  />
                </div>
                <span className="admin-bar-row__count">{suspendedUsers}</span>
              </div>
            </Card>
          </div>
        )}

        {tab === 'users' && (
          <Card>
            <div className="admin-search-box">
              <Search size={16} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search users by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <EmptyState icon={Users} title="No users found" description="Try a different search term." />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const status = u.accountStatus || 'Active';
                      return (
                        <tr key={u.email}>
                          <td><strong>{u.fullName}</strong></td>
                          <td>{u.email}</td>
                          <td>{formatDate(u.accountOpened)}</td>
                          <td>
                            <span className={`admin-status admin-status--${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => toggleStatus(u.email, status)}
                            >
                              {status === 'Active' ? (
                                <><ShieldBan size={15} /> Suspend</>
                              ) : (
                                <><ShieldCheck size={15} /> Activate</>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {tab === 'accounts' && (
          <Card>
            {users.length === 0 ? (
              <EmptyState icon={Landmark} title="No accounts yet" />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Account Holder</th>
                      <th>Account Number</th>
                      <th>IFSC</th>
                      <th>Branch</th>
                      <th>Type</th>
                      <th>Opened</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email}>
                        <td><strong>{u.fullName}</strong></td>
                        <td className="figure">{maskAccountNumber(u.accountNumber)}</td>
                        <td>{u.ifsc}</td>
                        <td>{u.branch}</td>
                        <td>{u.accountType}</td>
                        <td>{formatDate(u.accountOpened)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {tab === 'transactions' && (
          <Card
            title="All Transactions"
            subtitle="Combined ledger across transactions and bill payments (demo shared data)"
          >
            {combinedActivity.length === 0 ? (
              <EmptyState icon={Receipt} title="No transactions recorded yet" />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedActivity.map((t) => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td><strong>{t.description}</strong></td>
                        <td>
                          <span className={`admin-txn-type admin-txn-type--${t.type.toLowerCase()}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="figure">
                          {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
            </main>
    </div>
  </div>
</AuthenticatedLayout>
  );
}
