import { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  BadgeCheck,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Receipt,
  PlusCircle,
  FileBarChart,
} from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR, maskAccountNumber, getGreeting } from '../utils/format.js';
import './Dashboard.css';

const TRANSACTIONS = [
  { id: 1, name: 'Salary Credit', date: '01 Sep 2026', type: 'Credit', amount: 68000, status: 'Completed' },
  { id: 2, name: 'Grocery Store', date: '30 Aug 2026', type: 'Debit', amount: 2340, status: 'Completed' },
  { id: 3, name: 'Electricity Bill', date: '28 Aug 2026', type: 'Debit', amount: 1875, status: 'Completed' },
  { id: 4, name: 'Online Shopping', date: '26 Aug 2026', type: 'Debit', amount: 4520, status: 'Completed' },
  { id: 5, name: 'Money Transfer — R. Iyer', date: '24 Aug 2026', type: 'Debit', amount: 12000, status: 'Pending' },
];

const QUICK_ACTIONS = [
  { label: 'Transfer Money', icon: Send },
  { label: 'Pay Bills', icon: Receipt },
  { label: 'Add Money', icon: PlusCircle },
  { label: 'View Statement', icon: FileBarChart },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const totalBalance = 125450;
  const availableBalance = 98450;
  const savingsBalance = 42310;

  const display = (amount) => (balanceVisible ? formatINR(amount) : '••••••••');

  return (
    <AuthenticatedLayout>
      <div className="page-fade dashboard">
        <div className="dashboard__welcome">
          <div>
            <h1 className="dashboard__greeting">
              {getGreeting()}, {user?.fullName?.split(' ')[0] || 'there'}
            </h1>
            <p className="dashboard__subtitle">Here is your account overview.</p>
          </div>
          <button
            className="dashboard__visibility-toggle"
            onClick={() => setBalanceVisible((v) => !v)}
          >
            {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {balanceVisible ? 'Hide balances' : 'Show balances'}
          </button>
        </div>

        <div className="dashboard__balance-grid">
          <div className="balance-tile balance-tile--primary">
            <div className="balance-tile__top">
              <span className="balance-tile__label">Total Balance</span>
              <Wallet size={18} aria-hidden="true" />
            </div>
            <p className="figure balance-tile__amount">{display(totalBalance)}</p>
          </div>

          <div className="balance-tile">
            <div className="balance-tile__top">
              <span className="balance-tile__label">Available Balance</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
            <p className="figure balance-tile__amount">{display(availableBalance)}</p>
          </div>

          <div className="balance-tile">
            <div className="balance-tile__top">
              <span className="balance-tile__label">Savings Balance</span>
              <PiggyBank size={18} aria-hidden="true" />
            </div>
            <p className="figure balance-tile__amount">{display(savingsBalance)}</p>
          </div>

          <div className="balance-tile">
            <div className="balance-tile__top">
              <span className="balance-tile__label">Account Status</span>
              <BadgeCheck size={18} aria-hidden="true" />
            </div>
            <p className="balance-tile__status">
              <span className="balance-tile__status-dot" /> Active
            </p>
          </div>
        </div>

        <div className="dashboard__row">
          <div className="dashboard__col-main">
            <Card
              title="Recent Transactions"
              subtitle="Your last 5 account activities"
              padded={false}
              action={<Button variant="outline">View All Transactions</Button>}
            >
              <div className="transactions-table-wrap">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSACTIONS.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td className="transactions-table__muted">{t.date}</td>
                        <td>
                          <span className={`type-pill type-pill--${t.type.toLowerCase()}`}>
                            {t.type === 'Credit' ? (
                              <ArrowUpRight size={13} />
                            ) : (
                              <ArrowDownRight size={13} />
                            )}
                            {t.type}
                          </span>
                        </td>
                        <td
                          className={`figure transactions-table__amount ${
                            t.type === 'Credit' ? 'transactions-table__amount--credit' : ''
                          }`}
                        >
                          {t.type === 'Credit' ? '+' : '-'}
                          {formatINR(t.amount)}
                        </td>
                        <td>
                          <span className={`status-pill status-pill--${t.status.toLowerCase()}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="dashboard__quick-actions">
              <h2 className="dashboard__section-title">Quick Actions</h2>
              <div className="quick-actions-grid">
                {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                  <button className="quick-action-btn" key={label}>
                    <span className="quick-action-btn__icon">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard__col-side">
            <Card title="Account Summary" subtitle="Snapshot of your primary account">
              <dl className="summary-list">
                <div className="summary-list__row">
                  <dt>Account Holder</dt>
                  <dd>{user?.fullName}</dd>
                </div>
                <div className="summary-list__row">
                  <dt>Account Type</dt>
                  <dd>{user?.accountType}</dd>
                </div>
                <div className="summary-list__row">
                  <dt>Account Number</dt>
                  <dd className="figure">{maskAccountNumber(user?.accountNumber)}</dd>
                </div>
                <div className="summary-list__row">
                  <dt>IFSC Code</dt>
                  <dd className="figure">{user?.ifsc}</dd>
                </div>
                <div className="summary-list__row">
                  <dt>Branch</dt>
                  <dd>{user?.branch}</dd>
                </div>
                <div className="summary-list__row">
                  <dt>Account Status</dt>
                  <dd>
                    <span className="status-pill status-pill--completed">
                      {user?.accountStatus}
                    </span>
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
