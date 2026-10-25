
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
  HandCoins,
  TrendingUp,
  HeartPulse,
  Train,
  Plane,
  ShoppingBag,
  Gift,
  Bus,
  Gauge,
} from 'lucide-react';

import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import FeatureCard, {
  SectionHeading,
  FeatureGrid,
} from '../components/FeatureCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  formatINR,
  maskAccountNumber,
  getGreeting,
} from '../utils/format.js';
import {
  getBalances,
  spendingByCategory,
} from '../utils/bankData.js';
import {
  PAY_TRANSFER_FEATURES,
  DEPOSIT_FEATURES,
} from '../utils/features.js';
import './Dashboard.css';

// Sample activity is used to fill the transaction list.
// Saved transactions appear first.
const DEMO_TRANSACTIONS = [
  {
    id: 'd1',
    name: 'Salary Credit',
    date: '01 Sep 2026',
    type: 'Credit',
    amount: 68000,
    status: 'Completed',
  },
  {
    id: 'd2',
    name: 'Grocery Store',
    date: '30 Aug 2026',
    type: 'Debit',
    amount: 2340,
    status: 'Completed',
  },
  {
    id: 'd3',
    name: 'Electricity Bill',
    date: '28 Aug 2026',
    type: 'Debit',
    amount: 1875,
    status: 'Completed',
  },
  {
    id: 'd4',
    name: 'Online Shopping',
    date: '26 Aug 2026',
    type: 'Debit',
    amount: 4520,
    status: 'Completed',
  },
  {
    id: 'd5',
    name: 'Money Transfer — R. Iyer',
    date: '24 Aug 2026',
    type: 'Debit',
    amount: 12000,
    status: 'Pending',
  },
];

function getAllTransactions() {
  let saved = [];

  try {
    saved = JSON.parse(
      localStorage.getItem('fincentral_transactions') || '[]'
    );

    if (!Array.isArray(saved)) {
      saved = [];
    }
  } catch {
    saved = [];
  }

  return [...saved, ...DEMO_TRANSACTIONS];
}

// Dashboard quick actions
const QUICK_ACTIONS = [
  {
    label: 'Send Money',
    icon: Send,
    to: '/pay-transfer/send',
  },
  {
    label: 'Pay Bills',
    icon: Receipt,
    to: '/bill-payments',
  },
  {
    label: 'Open a Deposit',
    icon: Landmark,
    to: '/deposits',
  },
  {
    label: 'View Statement',
    icon: FileBarChart,
    to: '/statement',
  },
  {
    label: 'Convert Currency',
    icon: Coins,
    to: '/currency-converter',
  },
];

// Loans section
const LOAN_FEATURES = [
  {
    title: 'Loan Details',
    description:
      'View balances, due dates and active loan information.',
    icon: FileBarChart,
    to: '/loans/loan-details',
    cta: 'View details',
  },
  {
    title: 'Loan Repayment',
    description:
      'Estimate instalments and review repayment options.',
    icon: HandCoins,
    to: '/loans/loan-repayment',
    cta: 'Repay loan',
  },
  {
    title: 'Instant Overdraft',
    description:
      'Explore an illustrative overdraft eligibility limit.',
    icon: Wallet,
    to: '/loans/instant-overdraft',
    cta: 'Check eligibility',
  },
  {
    title: 'Gold OD Loan',
    description:
      'Estimate an overdraft secured against eligible gold.',
    icon: Coins,
    to: '/loans/gold-od-loan',
    cta: 'Explore facility',
  },
  {
    title: 'Account Statement',
    description:
      'Review sample loan statement activity.',
    icon: Receipt,
    to: '/loans/account-statement',
    cta: 'View statement',
  },
  {
    title: 'Loan Against Mutual Funds',
    description:
      'Estimate borrowing against eligible investments.',
    icon: TrendingUp,
    to: '/loans/loan-against-mutual-funds',
    cta: 'Estimate limit',
  },
  {
    title: 'Actual Interest Collected',
    description:
      'Review an illustrative interest summary.',
    icon: HandCoins,
    to: '/loans/actual-interest-collected',
    cta: 'View summary',
  },
];

// Lifestyle section
const LIFESTYLE_FEATURES = [
  {
    title: 'Healthcare',
    description: 'Explore healthcare service payments.',
    icon: HeartPulse,
    to: '/lifestyle/healthcare',
    cta: 'Explore',
  },
  {
    title: 'Train Tickets',
    description: 'Plan a rail journey.',
    icon: Train,
    to: '/lifestyle/train-tickets',
    cta: 'Search trains',
  },
  {
    title: 'Flights',
    description: 'Plan and search a sample flight journey.',
    icon: Plane,
    to: '/lifestyle/flights',
    cta: 'Search flights',
  },
  {
    title: 'Free Credit Score',
    description: 'View an illustrative credit profile.',
    icon: Gauge,
    to: '/lifestyle/free-credit-score',
    cta: 'View score',
  },
  {
    title: 'Shopping',
    description: 'Explore shopping categories and offers.',
    icon: ShoppingBag,
    to: '/lifestyle/shopping',
    cta: 'Browse offers',
  },
  {
    title: 'E-Gift Card',
    description: 'Prepare a digital gift card preview.',
    icon: Gift,
    to: '/lifestyle/e-gift-card',
    cta: 'Get a gift card',
  },
  {
    title: 'Bus',
    description: 'Plan an intercity bus journey.',
    icon: Bus,
    to: '/lifestyle/bus',
    cta: 'Search buses',
  },
];

const CHART_COLORS = [
  '#1e3a8a',
  '#2e63d1',
  '#5b8def',
  '#93b4f5',
  '#c5d6fa',
];

function SpendingChart({ data }) {
  const total = data.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total <= 0) {
    return (
      <p className="spending__empty">
        No spending data available.
      </p>
    );
  }

  return (
    <div className="spending">
      <svg
        viewBox="0 0 140 140"
        className="spending__donut"
        role="img"
        aria-label={`Spending by category, total ${formatINR(total)}`}
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#edf0f4"
          strokeWidth="18"
        />

        {data.map((item, index) => {
          const length =
            (item.amount / total) * circumference;

          const circle = (
            <circle
              key={item.category}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={
                CHART_COLORS[index % CHART_COLORS.length]
              }
              strokeWidth="18"
              strokeDasharray={`${length} ${
                circumference - length
              }`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );

          offset += length;
          return circle;
        })}

        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="spending__center-label"
        >
          Total spent
        </text>

        <text
          x="70"
          y="84"
          textAnchor="middle"
          className="spending__center-value"
        >
          ₹{Math.round(total).toLocaleString('en-IN')}
        </text>
      </svg>

      <ul className="spending__legend">
        {data.map((item, index) => (
          <li key={item.category}>
            <span
              className="spending__swatch"
              style={{
                background:
                  CHART_COLORS[index % CHART_COLORS.length],
              }}
            />

            <span className="spending__name">
              {item.category}
            </span>

            <span className="spending__pct">
              {Math.round((item.amount / total) * 100)}%
            </span>

            <span className="figure spending__amt">
              {formatINR(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [balanceVisible, setBalanceVisible] =
    useState(true);

  const allTransactions = useMemo(
    getAllTransactions,
    []
  );

  const recent = allTransactions.slice(0, 5);

  const spending = useMemo(
    () => spendingByCategory(allTransactions),
    [allTransactions]
  );

  const { total, available, savings } = getBalances();

  const firstName =
    user?.fullName?.split(' ')[0] || 'there';

  const display = (amount) =>
    balanceVisible
      ? formatINR(amount)
      : '••••••••';

  const summary = [
    {
      label: 'Total Balance',
      value: display(total),
      icon: Wallet,
      tone: 'primary',
    },
    {
      label: 'Available Balance',
      value: display(available),
      icon: ArrowUpRight,
      tone: 'plain',
    },
    {
      label: 'Savings Balance',
      value: display(savings),
      icon: PiggyBank,
      tone: 'plain',
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade dashboard">
        {/* Welcome */}
        <div className="dashboard__welcome">
          <div>
            <h1 className="dashboard__greeting">
              {getGreeting()}, {firstName}
            </h1>

            <p className="dashboard__subtitle">
              Here’s your financial overview.
            </p>
          </div>

          <button
            className="dashboard__visibility-toggle"
            onClick={() =>
              setBalanceVisible((visible) => !visible)
            }
            aria-pressed={!balanceVisible}
          >
            {balanceVisible ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}

            {balanceVisible
              ? 'Hide balance'
              : 'Show balance'}
          </button>
        </div>

        {/* Account balances */}
        <div className="dashboard__balance-grid">
          {summary.map(
            ({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className={`balance-tile ${
                  tone === 'primary'
                    ? 'balance-tile--primary'
                    : ''
                }`}
              >
                <div className="balance-tile__top">
                  <span className="balance-tile__label">
                    {label}
                  </span>

                  <span className="balance-tile__icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                </div>

                <p className="figure balance-tile__amount">
                  {value}
                </p>
              </div>
            )
          )}

          <div className="balance-tile">
            <div className="balance-tile__top">
              <span className="balance-tile__label">
                Account Status
              </span>

              <span className="balance-tile__icon">
                <BadgeCheck
                  size={18}
                  aria-hidden="true"
                />
              </span>
            </div>

            <p className="balance-tile__status">
              <span className="balance-tile__status-dot" />
              {user?.accountStatus || 'Active'}
            </p>

            <p className="balance-tile__meta figure">
              {maskAccountNumber(user?.accountNumber)}
            </p>
          </div>
        </div>

        {/* Pay and Transfer */}
        <SectionHeading
          id="pay-transfer"
          title="Pay & Transfer"
          subtitle="Move money to people and businesses."
          action={
            <Link
              to="/pay-transfer"
              className="dashboard__see-all"
            >
              View all
            </Link>
          }
        />

        <FeatureGrid>
          {PAY_TRANSFER_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </FeatureGrid>

        {/* Deposits and Investments */}
        <SectionHeading
          id="deposits"
          title="Deposits & Investments"
          subtitle="Grow your savings with fixed and recurring deposits."
          action={
            <Link
              to="/deposits"
              className="dashboard__see-all"
            >
              View all
            </Link>
          }
        />

        <FeatureGrid>
          {DEPOSIT_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </FeatureGrid>

        <p className="dashboard__demo-note">
          <Info size={14} aria-hidden="true" />
          Deposit rates and maturity values are demo data,
          not offers.
        </p>

        {/* Loans */}
        <SectionHeading
          id="loans"
          title="Loans"
          subtitle="Manage loan information, explore borrowing options and estimate repayments."
          action={
            <Link
              to="/loans/loan-details"
              className="dashboard__see-all"
            >
              View all
            </Link>
          }
        />

        <FeatureGrid>
          {LOAN_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </FeatureGrid>

        {/* Lifestyle */}
        <SectionHeading
          id="lifestyle"
          title="Lifestyle"
          subtitle="Discover travel, healthcare, shopping and everyday services."
          action={
            <Link
              to="/lifestyle/healthcare"
              className="dashboard__see-all"
            >
              View all
            </Link>
          }
        />

        <FeatureGrid>
          {LIFESTYLE_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </FeatureGrid>

        <p className="dashboard__demo-note">
          <Info size={14} aria-hidden="true" />
          Loans and Lifestyle tools use demo estimates.
          Live banking, booking and credit bureau services
          are not connected.
        </p>

        {/* Transactions, spending, and account tools */}
        <div className="dashboard__row">
          <div className="dashboard__col-main">
            <Card
              title="Recent Transactions"
              subtitle="Your latest account activity"
              padded={false}
              action={
                <Link
                  to="/transactions"
                  className="dashboard__see-all"
                >
                  View all
                </Link>
              }
            >
              <ul className="txn-list">
                {recent.map((transaction) => {
                  const credit =
                    (transaction.type || '').toLowerCase() ===
                    'credit';

                  return (
                    <li
                      key={transaction.id}
                      className="txn-list__item"
                    >
                      <span
                        className={`txn-list__icon txn-list__icon--${
                          credit ? 'credit' : 'debit'
                        }`}
                      >
                        {credit ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>

                      <div className="txn-list__main">
                        <p className="txn-list__name">
                          {transaction.name ||
                            transaction.description}
                        </p>

                        <p className="txn-list__date">
                          {transaction.date}
                        </p>
                      </div>

                      <span
                        className={`status-pill status-pill--${(
                          transaction.status || 'Completed'
                        ).toLowerCase()}`}
                      >
                        {transaction.status || 'Completed'}
                      </span>

                      <span
                        className={`figure txn-list__amount ${
                          credit
                            ? 'txn-list__amount--credit'
                            : ''
                        }`}
                      >
                        {credit ? '+' : '-'}
                        {formatINR(transaction.amount)}

                        <small>
                          {credit ? 'Credit' : 'Debit'}
                        </small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card
              title="Spending Overview"
              subtitle="Debits by category"
            >
              {spending.length ? (
                <SpendingChart data={spending} />
              ) : (
                <EmptyState
                  title="No spending yet"
                  description="Your category breakdown will appear here."
                />
              )}
            </Card>
          </div>

          <div className="dashboard__col-side">
            {/* Quick actions */}
            <Card
              title="Quick Actions"
              subtitle="Shortcuts to common tasks"
            >
              <div className="quick-actions-grid">
                {QUICK_ACTIONS.map(
                  ({ label, icon: Icon, to }) => (
                    <Link
                      className="quick-action-btn"
                      key={label}
                      to={to}
                    >
                      <span className="quick-action-btn__icon">
                        <Icon
                          size={18}
                          aria-hidden="true"
                        />
                      </span>

                      {label}
                    </Link>
                  )
                )}
              </div>
            </Card>

            {/* Upcoming payments */}
            <Card
              title="Upcoming Payments"
              subtitle="Scheduled bills and payments"
            >
              <div className="upcoming-empty">
                <CalendarClock
                  size={26}
                  aria-hidden="true"
                />

                <p>No scheduled payments yet.</p>

                <span>
                  Scheduling isn’t available yet — pay a
                  bill anytime from Bill Payments.
                </span>

                <Link
                  to="/bill-payments"
                  className="btn-link btn-link--outline"
                >
                  Go to Bill Payments
                </Link>
              </div>
            </Card>

            {/* Account summary */}
            <Card
              title="Account Summary"
              subtitle="Your primary account"
            >
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
                  <dt>IFSC Code</dt>
                  <dd className="figure">
                    {user?.ifsc}
                  </dd>
                </div>

                <div className="summary-list__row">
                  <dt>Branch</dt>
                  <dd>{user?.branch}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
