import { Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import './Banking.css';

// Polished placeholder for features that are not implemented yet.
export default function ComingSoon({ title, subtitle, description, linkTo = '/dashboard', linkLabel = 'Back to Dashboard' }) {
  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader title={title} subtitle={subtitle} />
        <Card>
          <div className="coming-soon">
            <span className="feature-card__icon feature-card__icon--blue" style={{ margin: '0 auto' }}>
              <Hourglass size={22} aria-hidden="true" />
            </span>
            <h2>Coming soon</h2>
            <p>{description}</p>
            <Link to={linkTo} className="btn-link">{linkLabel}</Link>
          </div>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
