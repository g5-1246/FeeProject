import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  PiggyBank,
  BadgeCheck,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Receipt,
  FileBarChart,
  Landmark,
  CalendarClock,
  Coins,
  Info,
} from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import FeatureCard, { SectionHeading, FeatureGrid } from '../components/FeatureCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR, maskAccountNumber, getGreeting } from '../utils/format.js';
import { getBalances, spendingByCategory } from '../utils/bankData.js';
import { PAY_TRANSFER_FEATURES, DEPOSIT_FEATURES } from '../utils/features.js';
import './Dashboard.css';

// Fallback sample activity, only shown to fill the list; real saved
// transactions (from Bill Payments etc.) always appear first.
const DEMO_TRANSACTIONS = [
  { id: 'd1', name: 'Salary Credit', date: '01 Sep 2026', type: 'Credit', amount: 68000, status: 'Completed' },
  { id: 'd2', name: 'Grocery Store', date: '30 Aug 2026', type: 'Debit', amount: 2340, status: 'Completed' },
  { id: 'd3', name: 'Electricity Bill', date: '28 Aug 2026', type: 'Debit', amount: 1875, status: 'Completed' },
  { id: 'd4', name: 'Online Shopping', date: '26 Aug 2026', type: 'Debit', amount: 4520, status: 'Completed' },
  { id: 'd5', name: 'Money Transfer — R. Iyer', date: '24 Aug 2026', type: 'Debit', amount: 12000, status: 'Pending' },
];

function getAllTransactions() {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem('fincentral_transactions') || '[]');
  } catch {
    saved = [];
  }
  return [...saved, ...DEMO_TRANSACTIONS];
}

const QUICK_ACTIONS = [
  { label: 'Send Money', icon: Send, to: '/pay-transfer/send' },
  { label: 'Pay Bills', icon: Receipt, to: '/bill-payments' },
  { label: 'Open a Deposit', icon: Landmark, to: '/deposits' },
  { label: 'View Statement', icon: FileBarChart, to: '/statement' },
  { label: 'Convert Currency', icon: Coins, to: '/currency-converter' },
];

const CHART_COLORS = ['#1e3a8a', '#2e63d1', '#5b8def', '#93b4f5', '#c5d6fa'];

function SpendingChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="spending">
      <svg viewBox="0 0 140 140" className="spending__donut" role="img"
        aria-label={`Spending by category, total ${formatINR(total)}`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#edf0f4" strokeWidth="18" />
        {data.map((d, i) => {
          const length = (d.amount / total) * circumference;
          const circle = (
            <circle
              key={d.category}
              cx="70" cy="70" r={radius} fill="none"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth="18"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += length;
          return circle;
        })}
        <text x="70" y="66" textAnchor="middle" className="spending__center-label">Total spent</text>
        <text x="70" y="84" textAnchor="middle" className="spending__center-value">
          ₹{Math.round(total).toLocaleString('en-IN')}
        </text>
      </svg>
      <ul className="spending__legend">
        {data.map((d, i) => (
          <li key={d.category}>
            <span className="spending__swatch" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="spending__name">{d.category}</span>
            <span className="spending__pct">{Math.round((d.amount / total) * 100)}%</span>
            <span className="figure spending__amt">{formatINR(d.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const allTransactions = useMemo(getAllTransactions, []);
  const recent = allTransactions.slice(0, 5);
  const spending = useMemo(() => spendingByCategory(allTransactions), [allTransactions]);
  const { total, available, savings } = getBalances();

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const display = (amount) => (balanceVisible ? formatINR(amount) : '••••••••');

  const summary = [
    { label: 'Total Balance', value: display(total), icon: Wallet, tone: 'primary' },
    { label: 'Available Balance', value: display(available), icon: ArrowUpRight, tone: 'plain' },
    { label: 'Savings Balance', value: display(savings), icon: PiggyBank, tone: 'plain' },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade dashboard">
        <div className="dashboard__welcome">
          <div>
            <h1 className="dashboard__greeting">
              {getGreeting()}, {firstName}
            </h1>
            <p className="dashboard__subtitle">Here’s your financial overview.</p>
          </div>
          <button
            className="dashboard__visibility-toggle"
            onClick={() => setBalanceVisible((v) => !v)}
            aria-pressed={!balanceVisible}
          >
            {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {balanceVisible ? 'Hide balance' : 'Show balance'}
          </button>
        </div>

        <div className="dashboard__balance-grid">
          {summary.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`balance-tile ${tone === 'primary' ? 'balance-tile--primary' : ''}`}>
              <div className="balance-tile__top">
                <span className="balance-tile__label">{label}</span>
                <span className="balance-tile__icon"><Icon size={18} aria-hidden="true" /></span>
              </div>
              <p className="figure balance-tile__amount">{value}</p>
            </div>
          ))}
          <div className="balance-tile">
            <div className="balance-tile__top">
              <span className="balance-tile__label">Account Status</span>
              <span className="balance-tile__icon"><BadgeCheck size={18} aria-hidden="true" /></span>
            </div>
            <p className="balance-tile__status">
              <span className="balance-tile__status-dot" /> {user?.accountStatus || 'Active'}
            </p>
            <p className="balance-tile__meta figure">{maskAccountNumber(user?.accountNumber)}</p>
          </div>
        </div>

        <SectionHeading
          id="pay-transfer"
          title="Pay & Transfer"
          subtitle="Move money to people and businesses."
          action={<Link to="/pay-transfer" className="dashboard__see-all">View all</Link>}
        />
        <FeatureGrid>
          {PAY_TRANSFER_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </FeatureGrid>

        <SectionHeading
          id="deposits"
          title="Deposits & Investments"
          subtitle="Grow your savings with fixed and recurring deposits."
          action={<Link to="/deposits" className="dashboard__see-all">View all</Link>}
        />
        <FeatureGrid>
          {DEPOSIT_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </FeatureGrid>
        <p className="dashboard__demo-note">
          <Info size={14} aria-hidden="true" /> Deposit rates and maturity values are demo data, not offers.
        </p>

        <div className="dashboard__row">
          <div className="dashboard__col-main">
            <Card
              title="Recent Transactions"
              subtitle="Your latest account activity"
              padded={false}
              action={<Link to="/transactions" className="dashboard__see-all">View all</Link>}
            >
              <ul className="txn-list">
                {recent.map((t) => {
                  const credit = (t.type || '').toLowerCase() === 'credit';
                  return (
                    <li key={t.id} className="txn-list__item">
                      <span className={`txn-list__icon txn-list__icon--${credit ? 'credit' : 'debit'}`}>
                        {credit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </span>
                      <div className="txn-list__main">
                        <p className="txn-list__name">{t.name || t.description}</p>
                        <p className="txn-list__date">{t.date}</p>
                      </div>
                      <span className={`status-pill status-pill--${(t.status || 'Completed').toLowerCase()}`}>
                        {t.status || 'Completed'}
                      </span>
                      <span className={`figure txn-list__amount ${credit ? 'txn-list__amount--credit' : ''}`}>
                        {credit ? '+' : '-'}{formatINR(t.amount)}
                        <small>{credit ? 'Credit' : 'Debit'}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card title="Spending Overview" subtitle="Debits by category">
              {spending.length ? (
                <SpendingChart data={spending} />
              ) : (
                <EmptyState title="No spending yet" description="Your category breakdown will appear here." />
              )}
            </Card>
          </div>

          <div className="dashboard__col-side">
            <Card title="Quick Actions" subtitle="Shortcuts to common tasks">
              <div className="quick-actions-grid">
                {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
                  <Link className="quick-action-btn" key={label} to={to}>
                    <span className="quick-action-btn__icon"><Icon size={18} aria-hidden="true" /></span>
                    {label}
                  </Link>
                ))}
              </div>
            </Card>

            <Card title="Upcoming Payments" subtitle="Scheduled bills and payments">
              <div className="upcoming-empty">
                <CalendarClock size={26} aria-hidden="true" />
                <p>No scheduled payments yet.</p>
                <span>Scheduling isn’t available yet — pay a bill anytime from Bill Payments.</span>
                <Link to="/bill-payments" className="btn-link btn-link--outline">Go to Bill Payments</Link>
              </div>
            </Card>

            <Card title="Account Summary" subtitle="Your primary account">
              <dl className="summary-list">
                <div className="summary-list__row"><dt>Account Holder</dt><dd>{user?.fullName}</dd></div>
                <div className="summary-list__row"><dt>Account Type</dt><dd>{user?.accountType}</dd></div>
                <div className="summary-list__row"><dt>IFSC Code</dt><dd className="figure">{user?.ifsc}</dd></div>
                <div className="summary-list__row"><dt>Branch</dt><dd>{user?.branch}</dd></div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
