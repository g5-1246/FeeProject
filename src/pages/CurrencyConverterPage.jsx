import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import CurrencyConverter from '../components/CurrencyConverter.jsx';
import './Banking.css';

export default function CurrencyConverterPage() {
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader title="Currency Converter" subtitle="Check live exchange rates across major currencies." />
        <CurrencyConverter />
      </div>
    </AuthenticatedLayout>
  );
}
