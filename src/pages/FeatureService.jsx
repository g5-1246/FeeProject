
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Search } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { EXTRA_SECTIONS } from '../utils/extraFeatures.js';
import './FeatureService.css';

const STORAGE_KEY = 'fincentral_extra_service_records';

const FIELD_CONFIG = {
  locker: ['Full Name', 'Mobile Number', 'Preferred Branch', 'Locker Size'],
  wealth: ['Full Name', 'Investment Amount', 'Investment Goal', 'Mobile Number'],
  portability: ['Account Number', 'Current Bank', 'New Branch', 'IFSC Code'],
  'cheque-book': ['Account Number', 'Number of Leaves', 'Delivery Address'],
  'cheque-status': ['Cheque Number', 'Account Number'],
  'stop-cheque': ['Cheque Number', 'Account Number', 'Reason'],
  nominee: ['Nominee Name', 'Relationship', 'Nominee Age', 'Mobile Number'],
  'balance-certificate': ['Account Number', 'Certificate Purpose'],
  'locker-details': ['Locker Number', 'Branch'],
  'pay-gst': ['GSTIN', 'Tax Period', 'Payment Amount'],
  'gst-status': ['Payment Reference'],
  'tax-receipt': ['Payment Reference'],
  'tax-payment': ['Tax Type', 'Tax Identification Number', 'Payment Amount'],
  'loan-details': ['Loan Account Number'],
  'loan-repayment': ['Loan Account Number', 'Repayment Amount'],
  overdraft: ['Account Number', 'Required Limit', 'Purpose'],
  'gold-od': ['Account Number', 'Gold Weight (grams)', 'Required Amount'],
  'loan-statement': ['Loan Account Number', 'From Date', 'To Date'],
  'mutual-fund-loan': ['Investment Value', 'Required Loan Amount', 'Fund Name'],
  'interest-collected': ['Loan Account Number'],
  healthcare: ['Service Type', 'Patient Name', 'Mobile Number'],
  train: ['From Station', 'To Station', 'Travel Date', 'Passengers'],
  flights: ['From City', 'To City', 'Travel Date', 'Passengers'],
  'credit-score': ['Full Name', 'Date of Birth', 'Mobile Number'],
  shopping: ['Product Category', 'Product Details', 'Budget'],
  'gift-card': ['Gift Card Amount', 'Recipient Email'],
  bus: ['From City', 'To City', 'Travel Date', 'Passengers'],
};

const TRACKING_SLUGS = ['gst-status', 'tax-receipt', 'cheque-status'];

function readRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function getInputType(field) {
  if (/date/i.test(field)) return 'date';
  if (/email/i.test(field)) return 'email';
  if (/amount|weight|limit|budget|passengers|age|leaves/i.test(field)) {
    return 'number';
  }
  return 'text';
}

export default function FeatureService() {
  const { slug } = useParams();

  const feature = EXTRA_SECTIONS
    .flatMap(section => section.features)
    .find(item => item.slug === slug);

  const [form, setForm] = useState({});
  const [records, setRecords] = useState(readRecords);
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');

  if (!feature) {
    return (
      <AuthenticatedLayout>
        <Card title="Service not found">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Card>
      </AuthenticatedLayout>
    );
  }

  const isTracking = TRACKING_SLUGS.includes(slug);

  const isPayment = [
    'pay-gst',
    'tax-payment',
    'loan-repayment',
  ].includes(slug);

  const currentRecords = records.filter(record => record.slug === slug);

  const trackableRecords = records.filter(record => {
    if (slug === 'gst-status' || slug === 'tax-receipt') {
      return ['pay-gst', 'tax-payment'].includes(record.slug);
    }

    return record.slug === 'cheque-book';
  });

  const matchedRecords = trackableRecords.filter(record =>
    !reference ||
    record.reference.toLowerCase().includes(reference.toLowerCase())
  );

  function handleChange(field, value) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const requestId = 'FC' + Date.now();

    const record = {
      id: requestId,
      reference: requestId,
      slug,
      title: feature.title,
      values: form,
      status: isPayment ? 'Submitted (Demo)' : 'Request Submitted',
      date: new Date().toLocaleString('en-IN'),
    };

    const updated = [record, ...records];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setRecords(updated);
    setForm({});
    setMessage(`Successfully submitted! Reference: ${requestId}`);
  }

  function printReceipt(record) {
    const receiptWindow = window.open('', '_blank');

    if (!receiptWindow) {
      setMessage('Please allow pop-ups to print the receipt.');
      return;
    }

    receiptWindow.document.write(`
      <html>
        <head>
          <title>FINCENTRAL BANK Receipt</title>
          <style>
            body { font-family: Arial; padding: 35px; }
            h1 { color: #173b78; }
            .line { border-bottom: 1px solid #ddd; padding: 12px 0; }
          </style>
        </head>
        <body>
          <h1>FINCENTRAL BANK</h1>
          <h2>${record.title}</h2>
          <p>Demo receipt / request acknowledgement</p>
          <div class="line">Reference: ${record.reference}</div>
          <div class="line">Status: ${record.status}</div>
          <div class="line">Date: ${record.date}</div>
          <p>This is not an official bank or GST payment receipt.</p>
          <script>window.print();<\/script>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  }

  return (
    <AuthenticatedLayout>
      <div className="extra-service-page">
        <Link to="/dashboard" className="extra-service-back">
          <ArrowLeft size={17} /> Back to Dashboard
        </Link>

        <PageHeader
          title={feature.title}
          subtitle={feature.description}
        />

        {message && (
          <div className="extra-service-alert">
            <CheckCircle size={18} />
            <span>{message}</span>
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        {isTracking ? (
          <Card title="Track Your Request">
            <label className="extra-service-label">
              Reference Number
            </label>

            <div className="extra-service-search">
              <Search size={18} />
              <input
                value={reference}
                onChange={event => setReference(event.target.value)}
                placeholder="Enter your reference number"
              />
            </div>

            {matchedRecords.length === 0 ? (
              <p className="extra-service-empty">
                No matching records found.
              </p>
            ) : (
              matchedRecords.map(record => (
                <div className="extra-service-record" key={record.id}>
                  <strong>{record.title}</strong>
                  <span>Reference: {record.reference}</span>
                  <span>Status: {record.status}</span>
                  <span>Date: {record.date}</span>
                  {slug === 'tax-receipt' && (
                    <button onClick={() => printReceipt(record)}>
                      <FileText size={16} /> Generate Demo Receipt
                    </button>
                  )}
                </div>
              ))
            )}
          </Card>
        ) : (
          <Card
            title={`${feature.title} Form`}
            subtitle="Enter the details below to submit your request."
          >
            <form onSubmit={handleSubmit}>
              <div className="extra-service-grid">
                {(FIELD_CONFIG[slug] || []).map(field => (
                  <div className="extra-service-field" key={field}>
                    <label htmlFor={field}>{field}</label>
                    <input
                      id={field}
                      type={getInputType(field)}
                      min={getInputType(field) === 'number' ? '1' : undefined}
                      required
                      value={form[field] || ''}
                      onChange={event =>
                        handleChange(field, event.target.value)
                      }
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <button className="extra-service-submit" type="submit">
                Submit Request
              </button>
            </form>
          </Card>
        )}

        <Card
          title="Recent Records"
          subtitle="Your saved requests in this browser."
        >
          {currentRecords.length === 0 ? (
            <p className="extra-service-empty">No records available yet.</p>
          ) : (
            currentRecords.map(record => (
              <div className="extra-service-record" key={record.id}>
                <strong>{record.title}</strong>
                <span>Reference: {record.reference}</span>
                <span>Status: {record.status}</span>
                <span>Date: {record.date}</span>
                {record.slug === 'pay-gst' ||
                record.slug === 'tax-payment' ? (
                  <button onClick={() => printReceipt(record)}>
                    <FileText size={16} /> Print Demo Acknowledgement
                  </button>
                ) : null}
              </div>
            ))
          )}
        </Card>

        <p className="extra-service-note">
          Demo mode: information is saved in your browser using localStorage.
          No real banking transaction, GST payment, loan approval, credit
          enquiry or travel booking takes place.
        </p>
      </div>
    </AuthenticatedLayout>
  );
}
