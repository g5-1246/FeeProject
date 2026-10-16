import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatINR, formatDate } from '../utils/format.js';
import { getDeposits } from '../utils/bankData.js';
import './Banking.css';

export default function MyDeposits() {
  const deposits = getDeposits();
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader title="My Deposits" subtitle="Your fixed and recurring deposits." />
        <Card padded={false}>
          {deposits.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No deposits yet"
              description="Online deposit opening isn’t available yet. You can still explore plans and estimate returns."
              action={<Link to="/deposits" className="btn-link">Explore Deposits</Link>}
            />
          ) : (
            <ul className="banking-list">
              {deposits.map((d) => (
                <li key={d.id} className="banking-list__item">
                  <span className="banking-list__avatar">{(d.type || 'FD').toUpperCase()}</span>
                  <div className="banking-list__main">
                    <p className="banking-list__title">{d.type?.toUpperCase()} · {d.rate}% p.a.</p>
                    <p className="banking-list__sub">Opened {formatDate(d.openedOn)} · Matures {formatDate(d.maturesOn)}</p>
                  </div>
                  <p className="figure banking-list__amount">{formatINR(d.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
