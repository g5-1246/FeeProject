import { Info } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FeatureCard, { FeatureGrid } from '../components/FeatureCard.jsx';
import { DEPOSIT_FEATURES } from '../utils/features.js';
import './Banking.css';

export default function Deposits() {
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page">
        <PageHeader title="Deposits & Investments" subtitle="Explore fixed and recurring deposits." />
        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>All interest rates and maturity values shown are demo data, not real offers.</span>
        </div>
        <FeatureGrid>
          {DEPOSIT_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </FeatureGrid>
      </div>
    </AuthenticatedLayout>
  );
}
