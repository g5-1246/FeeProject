import { Info } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FeatureCard, { FeatureGrid } from '../components/FeatureCard.jsx';
import { PAY_TRANSFER_FEATURES } from '../utils/features.js';
import './Banking.css';

export default function PayTransfer() {
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page">
        <PageHeader title="Pay & Transfer" subtitle="Send money, manage payees and review your transfer requests." />
        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            This is a frontend demo. Transfers are saved as demo requests only — no real money moves and
            your balances do not change.
          </span>
        </div>
        <FeatureGrid>
          {PAY_TRANSFER_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </FeatureGrid>
      </div>
    </AuthenticatedLayout>
  );
}
