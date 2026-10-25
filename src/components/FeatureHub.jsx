
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Wallet,
  PiggyBank,
  BadgeCheck,
  HeartPulse,
  Train,
  Plane,
  ShoppingBag,
  Gift,
  Bus,
  FileText,
  Coins,
  ArrowRight,
  LayoutGrid,
  X,
} from 'lucide-react';
import './FeatureHub.css';

const FEATURES = [
  {
    title: 'Pay & Transfer',
    description: 'Manage payments and transfer money securely.',
    icon: Wallet,
    to: '/pay-transfer',
    category: 'Banking',
    tone: 'blue',
  },
  {
    title: 'Deposits & Investments',
    description: 'Explore deposits, savings and investment options.',
    icon: PiggyBank,
    to: '/deposits',
    category: 'Banking',
    tone: 'green',
  },
  {
    title: 'Loan Details',
    description: 'View your loan information and outstanding balance.',
    icon: FileText,
    to: '/loans/loan-details',
    category: 'Loans',
    tone: 'purple',
  },
  {
    title: 'Loan Repayment',
    description: 'Review repayment information for your loan.',
    icon: Coins,
    to: '/loans/loan-repayment',
    category: 'Loans',
    tone: 'orange',
  },
  {
    title: 'Instant Overdraft',
    description: 'Explore overdraft services and account flexibility.',
    icon: Wallet,
    to: '/loans/instant-overdraft',
    category: 'Loans',
    tone: 'blue',
  },
  {
    title: 'Gold OD Loan',
    description: 'Explore loan options against eligible gold.',
    icon: Coins,
    to: '/loans/gold-od-loan',
    category: 'Loans',
    tone: 'gold',
  },
  {
    title: 'Account Statement',
    description: 'Access account and loan statement services.',
    icon: FileText,
    to: '/loans/account-statement',
    category: 'Loans',
    tone: 'teal',
  },
  {
    title: 'Loan Against Mutual Funds',
    description: 'Learn about borrowing against eligible mutual funds.',
    icon: PiggyBank,
    to: '/loans/loan-against-mutual-funds',
    category: 'Loans',
    tone: 'green',
  },
  {
    title: 'Actual Interest Collected',
    description: 'Review interest-related information and services.',
    icon: Coins,
    to: '/loans/actual-interest-collected',
    category: 'Loans',
    tone: 'purple',
  },
  {
    title: 'Healthcare',
    description: 'Explore healthcare-related services.',
    icon: HeartPulse,
    to: '/lifestyle/healthcare',
    category: 'Lifestyle',
    tone: 'red',
  },
  {
    title: 'Train Tickets',
    description: 'Open train ticket booking services.',
    icon: Train,
    to: '/lifestyle/train-tickets',
    category: 'Lifestyle',
    tone: 'blue',
  },
  {
    title: 'Flights',
    description: 'Explore flight booking services.',
    icon: Plane,
    to: '/lifestyle/flights',
    category: 'Lifestyle',
    tone: 'purple',
  },
  {
    title: 'Free Credit Score',
    description: 'Find services for checking your credit score.',
    icon: BadgeCheck,
    to: '/lifestyle/free-credit-score',
    category: 'Lifestyle',
    tone: 'green',
  },
  {
    title: 'Shopping',
    description: 'Explore shopping offers and services.',
    icon: ShoppingBag,
    to: '/lifestyle/shopping',
    category: 'Lifestyle',
    tone: 'orange',
  },
  {
    title: 'E-Gift Card',
    description: 'Explore digital gift card services.',
    icon: Gift,
    to: '/lifestyle/e-gift-card',
    category: 'Lifestyle',
    tone: 'red',
  },
  {
    title: 'Bus',
    description: 'Open bus ticket booking services.',
    icon: Bus,
    to: '/lifestyle/bus',
    category: 'Lifestyle',
    tone: 'teal',
  },
];

const CATEGORIES = ['All', 'Banking', 'Loans', 'Lifestyle'];

export default function FeatureHub() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFeatures = useMemo(() => {
    const query = search.trim().toLowerCase();

    return FEATURES.filter((feature) => {
      const matchesCategory =
        activeCategory === 'All' || feature.category === activeCategory;

      const matchesSearch =
        !query ||
        feature.title.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query) ||
        feature.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="feature-hub">
      <section className="feature-hub__hero">
        <div className="feature-hub__hero-content">
          <span className="feature-hub__eyebrow">
            <LayoutGrid size={15} />
            YOUR FINANCIAL SERVICES
          </span>

          <h1>Feature Hub</h1>

          <p>
            Everything you need in one place. Discover banking, loan, and
            lifestyle services with ease.
          </p>

          <div className="feature-hub__search">
            <Search size={20} aria-hidden="true" />

            <input
              type="search"
              placeholder="Search features..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search features"
            />

            {search && (
              <button
                type="button"
                className="feature-hub__clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="feature-hub__hero-art" aria-hidden="true">
          <div className="feature-hub__art-circle feature-hub__art-circle--one" />
          <div className="feature-hub__art-circle feature-hub__art-circle--two" />
          <div className="feature-hub__art-card">
            <div className="feature-hub__art-card-icon">
              <Wallet size={30} />
            </div>
            <span>All your services</span>
            <strong>One simple hub</strong>
            <div className="feature-hub__art-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="feature-hub__content">
        <div className="feature-hub__toolbar">
          <div>
            <h2>Explore features</h2>
            <p>
              {filteredFeatures.length}{' '}
              {filteredFeatures.length === 1 ? 'feature' : 'features'} available
            </p>
          </div>

          <div className="feature-hub__filters" aria-label="Filter by category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`feature-hub__filter ${
                  activeCategory === category
                    ? 'feature-hub__filter--active'
                    : ''
                }`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredFeatures.length > 0 ? (
          <div className="feature-hub__grid">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  to={feature.to}
                  className="feature-hub-card"
                  key={feature.title}
                >
                  <div className="feature-hub-card__top">
                    <span
                      className={`feature-hub-card__icon feature-hub-card__icon--${feature.tone}`}
                    >
                      <Icon size={23} aria-hidden="true" />
                    </span>

                    <span className="feature-hub-card__category">
                      {feature.category}
                    </span>
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <span className="feature-hub-card__link">
                    Explore <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="feature-hub__empty">
            <Search size={32} />
            <h3>No features found</h3>
            <p>Try another search term or choose a different category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
