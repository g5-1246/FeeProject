
import { useState } from 'react';
import { Info, Calculator, PiggyBank } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FeatureCard, { FeatureGrid } from '../components/FeatureCard.jsx';
import { DEPOSIT_FEATURES } from '../utils/features.js';
import './Banking.css';

export default function Deposits() {
  const [type, setType] = useState('FD');
  const [amount, setAmount] = useState('10000');
  const [years, setYears] = useState('1');
  const [rate, setRate] = useState('7');
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fincentral_deposits') || '[]');
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState('');

  const principal = Number(amount);
  const time = Number(years);
  const interestRate = Number(rate);

  const maturity =
    type === 'FD'
      ? principal * Math.pow(1 + interestRate / 400, 4 * time)
      : principal * time * 12 +
        (principal * interestRate * time * 12) / 2400;

  function handleDeposit(e) {
    e.preventDefault();

    if (principal <= 0 || time <= 0 || interestRate < 0) {
      setMessage('Enter a valid amount, tenure, and interest rate.');
      return;
    }

    const record = {
      id: `DEP${Date.now()}`,
      type,
      amount: principal,
      years: time,
      rate: interestRate,
      maturity: Math.round(maturity * 100) / 100,
      date: new Date().toLocaleDateString(),
    };

    const updated = [record, ...records];
    localStorage.setItem('fincentral_deposits', JSON.stringify(updated));
    setRecords(updated);
    setMessage(`${type} deposit record saved successfully.`);
  }

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page">
        <PageHeader
          title="Deposits & Investments"
          subtitle="Explore fixed and recurring deposits."
        />

        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            Interest rates and maturity values are estimates for demonstration,
            not real bank offers.
          </span>
        </div>

        <FeatureGrid>
          {DEPOSIT_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </FeatureGrid>

        <section className="banking-section">
          <h2>
            <Calculator size={20} /> Deposit Calculator
          </h2>

          {message && <p role="status">{message}</p>}

          <form onSubmit={handleDeposit}>
            <label htmlFor="deposit-type">Deposit type</label>
            <select
              id="deposit-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="FD">Fixed Deposit (FD)</option>
              <option value="RD">Recurring Deposit (RD)</option>
            </select>

            <label htmlFor="deposit-amount">
              {type === 'FD' ? 'Deposit amount (₹)' : 'Monthly deposit (₹)'}
            </label>
            <input
              id="deposit-amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label htmlFor="deposit-years">Tenure (years)</label>
            <select
              id="deposit-years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            >
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
            </select>

            <label htmlFor="deposit-rate">Annual interest rate (%)</label>
            <input
              id="deposit-rate"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />

            <h3>
              Estimated maturity amount: ₹
              {Number.isFinite(maturity) && maturity > 0
                ? maturity.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : '0.00'}
            </h3>

            <button type="submit">Save Deposit Record</button>
          </form>
        </section>

        <section className="banking-section">
          <h2>
            <PiggyBank size={20} /> My Deposit Records
          </h2>

          {records.length === 0 ? (
            <p>No deposit records saved yet.</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="demo-notice">
                <div>
                  <strong>{record.type} — {record.id}</strong>
                  <p>Date: {record.date}</p>
                  <p>Principal/monthly deposit: ₹{record.amount.toLocaleString('en-IN')}</p>
                  <p>Tenure: {record.years} year(s) at {record.rate}%</p>
                  <p>
                    Estimated maturity: ₹
                    {record.maturity.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
