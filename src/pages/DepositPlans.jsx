
import { useState } from 'react';
import { Info, CheckCircle } from 'lucide-react';

import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

import { formatINR } from '../utils/format.js';
import {
  DEMO_RATES,
  fdMaturity,
  rdMaturity,
  addDeposit,
} from '../utils/bankData.js';

import './Banking.css';

export default function DepositPlans({ type = 'fd' }) {
  const isFd = type === 'fd';
  const plans = DEMO_RATES[type];

  const [years, setYears] = useState(String(plans[0].years));
  const [amount, setAmount] = useState(isFd ? '100000' : '5000');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const plan = plans.find(
    p => p.years === Number(years)
  );

  const n = Number(amount);
  const min = isFd ? 5000 : 500;

  const error =
    !amount || !Number.isFinite(n)
      ? 'Enter a valid amount.'
      : n < min
        ? `Minimum amount is ${formatINR(min)}.`
        : '';

  const calc = isFd
    ? fdMaturity(n, plan.rate, plan.years)
    : rdMaturity(n, plan.rate, plan.years);

  function handleDeposit() {
    setMessage('');
    setErrorMessage('');

    if (error) {
      setErrorMessage(error);
      return;
    }

    const openedDate = new Date();
    const maturityDate = new Date();

    maturityDate.setFullYear(
      maturityDate.getFullYear() + plan.years
    );

    const deposit = addDeposit({
      type: isFd ? 'fd' : 'rd',
      amount: n,
      rate: plan.rate,
      years: plan.years,
      invested: calc.invested,
      interest: calc.interest,
      maturity: calc.maturity,
      openedOn: openedDate.toISOString(),
      maturesOn: maturityDate.toISOString(),
    });

    setMessage(
      `${isFd ? 'Fixed Deposit' : 'Recurring Deposit'} created successfully! Reference: ${deposit.id}`
    );

    setAmount(isFd ? '100000' : '5000');
  }

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page">

        <PageHeader
          title={isFd ? 'Fixed Deposit (FD)' : 'Recurring Deposit (RD)'}
          subtitle={
            isFd
              ? 'Invest a lump sum for a fixed tenure.'
              : 'Save a fixed amount every month.'
          }
        />

        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            Interest rates and deposit creation are for demonstration
            purposes only. No real bank deposit is created.
          </span>
        </div>

        <Card title="Available Plans" padded={false}>
          <table className="plan-table">
            <thead>
              <tr>
                <th>Tenure</th>
                <th>Interest p.a.</th>
              </tr>
            </thead>

            <tbody>
              {plans.map(p => (
                <tr key={p.years}>
                  <td>
                    {p.years} {p.years === 1 ? 'year' : 'years'}
                  </td>
                  <td className="figure">
                    {p.rate.toFixed(2)}%
                    <span className="demo-tag">Demo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card
          title="Estimate your deposit"
          subtitle="Calculate your estimated returns."
        >
          <div className="form-grid">

            <div className="form-field">
              <label htmlFor="dep-amount">
                {isFd ? 'Deposit amount (₹)' : 'Monthly instalment (₹)'}
              </label>

              <input
                id="dep-amount"
                type="number"
                min={min}
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setErrorMessage('');
                }}
              />
            </div>

            <div className="form-field">
              <label htmlFor="dep-tenure">Tenure</label>

              <select
                id="dep-tenure"
                value={years}
                onChange={e => setYears(e.target.value)}
              >
                {plans.map(p => (
                  <option key={p.years} value={p.years}>
                    {p.years} {p.years === 1 ? 'year' : 'years'}
                    {' — '}
                    {p.rate.toFixed(2)}% (demo)
                  </option>
                ))}
              </select>
            </div>

          </div>

          {!error && (
            <div className="result-grid" aria-live="polite">

              <div className="result-box">
                <span>Total invested</span>
                <strong>{formatINR(calc.invested)}</strong>
              </div>

              <div className="result-box">
                <span>Interest earned (demo)</span>
                <strong>{formatINR(calc.interest)}</strong>
              </div>

              <div className="result-box result-box--main">
                <span>Maturity value (demo)</span>
                <strong>{formatINR(calc.maturity)}</strong>
              </div>

            </div>
          )}

          {errorMessage && (
            <p className="form-error">{errorMessage}</p>
          )}

          {message && (
            <div className="deposit-success">
              <CheckCircle size={19} />
              <span>{message}</span>
            </div>
          )}

          <div className="form-actions">
            <Button
              onClick={handleDeposit}
              disabled={Boolean(error)}
              icon={CheckCircle}
            >
              {isFd ? 'Create Fixed Deposit' : 'Start Recurring Deposit'}
            </Button>
          </div>

          <p className="form-hint" style={{ marginTop: 12 }}>
            Demo mode: this creates a local deposit record only.
            No money is debited from your account.
          </p>

        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
