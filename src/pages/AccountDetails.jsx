import { useState } from 'react';
import { Copy, Check, Landmark } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { maskAccountNumber, formatDate } from '../utils/format.js';
import './AccountDetails.css';

export default function AccountDetails() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(user?.accountNumber || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const rows = [
    { label: 'Account Holder Name', value: user?.fullName },
    { label: 'Account Number', value: maskAccountNumber(user?.accountNumber), mono: true },
    { label: 'IFSC Code', value: user?.ifsc, mono: true },
    { label: 'Account Type', value: user?.accountType },
    { label: 'Branch', value: user?.branch },
    { label: 'Account Opening Date', value: formatDate(user?.accountOpened) },
    { label: 'Account Status', value: user?.accountStatus, pill: true },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade account-details">
        <h1 className="account-details__heading">Account Details</h1>
        <p className="account-details__subtitle">
          Your account information, kept secure and partially masked.
        </p>

        {copied && (
          <div className="account-details__alert">
            <Alert type="success" message="Account number copied to clipboard." />
          </div>
        )}

        <div className="account-details__card">
          <Card
            icon={Landmark}
            title="Primary Savings Account"
            subtitle="FINCENTRAL BANK"
            action={
              <button className="account-details__copy-btn" onClick={handleCopy}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy Account Number'}
              </button>
            }
          >
            <dl className="account-details__list">
              {rows.map(({ label, value, mono, pill }) => (
                <div className="account-details__row" key={label}>
                  <dt>{label}</dt>
                  <dd className={mono ? 'figure' : ''}>
                    {pill ? (
                      <span className="status-pill status-pill--completed">{value}</span>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
