
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Coins,
  Wallet,
  PiggyBank,
  HeartPulse,
  Train,
  Plane,
  BadgeCheck,
  ShoppingBag,
  Gift,
  Bus,
} from 'lucide-react';
import './LoansLifestyle.css';

const FEATURES = {
  'loan-details': {
    title: 'Loan Details',
    description: 'View your loan information and outstanding balance.',
    icon: FileText,
    section: 'loans',
  },
  'loan-repayment': {
    title: 'Loan Repayment',
    description: 'Review your loan repayment information.',
    icon: Coins,
    section: 'loans',
  },
  'instant-overdraft': {
    title: 'Instant Overdraft',
    description: 'Explore overdraft services and account flexibility.',
    icon: Wallet,
    section: 'loans',
  },
  'gold-od-loan': {
    title: 'Gold OD Loan',
    description: 'Explore loan options against eligible gold.',
    icon: Coins,
    section: 'loans',
  },
  'account-statement': {
    title: 'Account Statement',
    description: 'Access your account and loan statements.',
    icon: FileText,
    section: 'loans',
  },
  'loan-against-mutual-funds': {
    title: 'Loan Against Mutual Funds',
    description: 'Learn about borrowing against eligible mutual funds.',
    icon: PiggyBank,
    section: 'loans',
  },
  'actual-interest-collected': {
    title: 'Actual Interest Collected',
    description: 'Review interest-related information.',
    icon: Coins,
    section: 'loans',
  },
  healthcare: {
    title: 'Healthcare',
    description: 'Explore healthcare-related services.',
    icon: HeartPulse,
    section: 'lifestyle',
  },
  'train-tickets': {
    title: 'Train Tickets',
    description: 'Explore train ticket booking services.',
    icon: Train,
    section: 'lifestyle',
  },
  flights: {
    title: 'Flights',
    description: 'Explore flight booking services.',
    icon: Plane,
    section: 'lifestyle',
  },
  'free-credit-score': {
    title: 'Free Credit Score',
    description: 'Find services for checking your credit score.',
    icon: BadgeCheck,
    section: 'lifestyle',
  },
  shopping: {
    title: 'Shopping',
    description: 'Explore shopping offers and services.',
    icon: ShoppingBag,
    section: 'lifestyle',
  },
  'e-gift-card': {
    title: 'E-Gift Card',
    description: 'Explore digital gift card services.',
    icon: Gift,
    section: 'lifestyle',
  },
  bus: {
    title: 'Bus',
    description: 'Explore bus ticket booking services.',
    icon: Bus,
    section: 'lifestyle',
  },
};

export default function LoansLifestyle({ section }) {
  const { feature } = useParams();

  const selected = feature ? FEATURES[feature] : null;
  const validSection = selected?.section === section;
  const Icon = validSection ? selected.icon : null;

  return (
    <main className="loans-lifestyle">
      <Link className="ll-back" to="/dashboard">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {!feature ? (
        <>
          <p className="ll-eyebrow">FINCENTRAL BANK</p>
          <h1>{section === 'loans' ? 'Loans' : 'Lifestyle'}</h1>
          <p className="ll-description">
            {section === 'loans'
              ? 'Explore your loan services.'
              : 'Explore lifestyle services.'}
          </p>

          <div className="ll-grid">
            {Object.entries(FEATURES)
              .filter(([, item]) => item.section === section)
              .map(([slug, item]) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    className="ll-card"
                    to={`/${section}/${slug}`}
                    key={slug}
                  >
                    <ItemIcon size={24} />
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <span>Explore →</span>
                  </Link>
                );
              })}
          </div>
        </>
      ) : validSection ? (
        <section className="ll-detail">
          <span className="ll-detail-icon">
            <Icon size={32} />
          </span>
          <p className="ll-eyebrow">
            {section === 'loans' ? 'LOAN SERVICES' : 'LIFESTYLE SERVICES'}
          </p>
          <h1>{selected.title}</h1>
          <p className="ll-description">{selected.description}</p>

          <div className="ll-notice">
            <strong>{selected.title}</strong>
            <p>
              This section is ready for its service-specific functionality.
              No real loan application, booking, or payment is performed here.
            </p>
          </div>

          <Link className="ll-primary" to={`/${section}`}>
            View all {section === 'loans' ? 'loan services' : 'lifestyle services'}
          </Link>
        </section>
      ) : (
        <section className="ll-detail">
          <h1>Feature not found</h1>
          <p className="ll-description">
            This feature does not exist in the {section} section.
          </p>
          <Link className="ll-primary" to={`/${section}`}>
            Return to {section}
          </Link>
        </section>
      )}
    </main>
  );
}
