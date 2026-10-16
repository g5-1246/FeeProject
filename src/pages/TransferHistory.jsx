import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatINR, formatDate } from '../utils/format.js';
import { getTransfers } from '../utils/bankData.js';
import './Banking.css';

export default function TransferHistory() {
  const transfers = getTransfers();
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader
          title="Transfer History"
          subtitle="Demo transfer requests saved from Send Money and Quick Pay."
          action={<Link to="/pay-transfer/send" className="btn-link">New Transfer</Link>}
        />
        <Card padded={false}>
          {transfers.length === 0 ? (
            <EmptyState icon={History} title="No transfers yet" description="Requests you save will be listed here." />
          ) : (
            <ul className="banking-list">
              {transfers.map((t) => (
                <li key={t.id} className="banking-list__item">
                  <span className="banking-list__avatar">{t.payeeName.slice(0, 2).toUpperCase()}</span>
                  <div className="banking-list__main">
                    <p className="banking-list__title">{t.payeeName}</p>
                    <p className="banking-list__sub">
                      {formatDate(t.createdOn)} · {t.method} · ••••{t.accountLast4}{t.remark ? ` · ${t.remark}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="figure banking-list__amount">{formatINR(t.amount)}</p>
                    <span className="status-pill status-pill--pending">{t.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
