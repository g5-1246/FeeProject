import { useState } from 'react';
import { Info, Lock } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { formatINR } from '../utils/format.js';
import { DEMO_RATES, fdMaturity, rdMaturity } from '../utils/bankData.js';
import './Banking.css';

// type="fd" | "rd". Explore plans with an illustrative estimate. Opening a
// deposit is not supported (no backend), so the action is a clear placeholder.
export default function DepositPlans({ type = 'fd' }) {
  const isFd = type === 'fd';
  const plans = DEMO_RATES[type];
  const [years, setYears] = useState(plans[0].years);
  const [amount, setAmount] = useState(isFd ? '100000' : '5000');
  const [touched, setTouched] = useState(false);

  const plan = plans.find((p) => p.years === Number(years));
  const n = Number(amount);
  const min = isFd ? 5000 : 500;
  const error = !amount ? 'Enter an amount.' : n < min ? `Minimum is ${formatINR(min)}.` : '';
  const calc = isFd ? fdMaturity(n, plan.rate, plan.years) : rdMaturity(n, plan.rate, plan.years);

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page">
        <PageHeader
          title={isFd ? 'Fixed Deposit (FD)' : 'Recurring Deposit (RD)'}
          subtitle={isFd ? 'Lock in a lump sum for a fixed tenure.' : 'Save a fixed amount every month.'}
        />
        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>Rates below are <strong>demo data</strong> and are not offers from FINCENTRAL BANK.</span>
        </div>

        <Card title="Plans" padded={false}>
          <table className="plan-table">
            <thead><tr><th>Tenure</th><th>Interest p.a.</th></tr></thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.years}>
                  <td>{p.years} {p.years === 1 ? 'year' : 'years'}</td>
                  <td className="figure">{p.rate.toFixed(2)}%<span className="demo-tag">Demo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Estimate your deposit" subtitle="Illustrative only">
          <div className="form-grid">
            <div className={`form-field ${touched && error ? 'form-field--error' : ''}`}>
              <label htmlFor="dep-amount">{isFd ? 'Deposit amount (₹)' : 'Monthly instalment (₹)'}</label>
              <input id="dep-amount" type="number" min={min} value={amount}
                onChange={(e) => { setAmount(e.target.value); setTouched(true); }} />
              {touched && error && <span className="form-error">{error}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="dep-tenure">Tenure</label>
              <select id="dep-tenure" value={years} onChange={(e) => setYears(e.target.value)}>
                {plans.map((p) => <option key={p.years} value={p.years}>{p.years} {p.years === 1 ? 'year' : 'years'} — {p.rate.toFixed(2)}% (demo)</option>)}
              </select>
            </div>
          </div>
          {!error && (
            <div className="result-grid" aria-live="polite">
              <div className="result-box"><span>Total invested</span><strong>{formatINR(calc.invested)}</strong></div>
              <div className="result-box"><span>Interest earned (demo)</span><strong>{formatINR(calc.interest)}</strong></div>
              <div className="result-box result-box--main"><span>Maturity value (demo)</span><strong>{formatINR(calc.maturity)}</strong></div>
            </div>
          )}
          <div className="form-actions">
            <Button disabled icon={Lock}>{isFd ? 'Open FD — coming soon' : 'Start RD — coming soon'}</Button>
          </div>
          <p className="form-hint" style={{ marginTop: 10 }}>
            Opening deposits online isn’t available yet, so no deposit is created and no money is debited.
          </p>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
