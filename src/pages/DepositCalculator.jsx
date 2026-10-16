import { useState } from 'react';
import { Info } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import { formatINR } from '../utils/format.js';
import { DEMO_RATES, fdMaturity, rdMaturity } from '../utils/bankData.js';
import './Banking.css';

export default function DepositCalculator() {
  const [kind, setKind] = useState('fd');
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('3');

  const errors = {};
  if (!(Number(amount) > 0)) errors.amount = 'Enter an amount greater than zero.';
  const r = Number(rate);
  if (rate === '' || r < 0 || r > 20) errors.rate = 'Rate must be between 0 and 20%.';
  const y = Number(years);
  if (!(y >= 0.5 && y <= 10)) errors.years = 'Tenure must be between 0.5 and 10 years.';
  const valid = Object.keys(errors).length === 0;
  const calc = valid
    ? (kind === 'fd' ? fdMaturity(amount, r, y) : rdMaturity(amount, r, y))
    : null;

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader title="Deposit Calculator" subtitle="Estimate maturity amount and interest." />
        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            Results are estimates using quarterly compounding and a rate you choose. Sample demo rates:{' '}
            FD {DEMO_RATES.fd[0].rate}–{DEMO_RATES.fd[2].rate}%, RD {DEMO_RATES.rd[0].rate}–{DEMO_RATES.rd[2].rate}%.
            Not a quote.
          </span>
        </div>
        <Card>
          <div className="tab-switch" role="group" aria-label="Deposit type">
            <button aria-pressed={kind === 'fd'} onClick={() => setKind('fd')}>Fixed Deposit</button>
            <button aria-pressed={kind === 'rd'} onClick={() => setKind('rd')}>Recurring Deposit</button>
          </div>
          <div className="form-grid" style={{ marginTop: 18 }}>
            <div className={`form-field form-field--full ${errors.amount ? 'form-field--error' : ''}`}>
              <label htmlFor="c-amount">{kind === 'fd' ? 'Deposit amount (₹)' : 'Monthly instalment (₹)'}</label>
              <input id="c-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>
            <div className={`form-field ${errors.rate ? 'form-field--error' : ''}`}>
              <label htmlFor="c-rate">Interest rate (% p.a., demo)</label>
              <input id="c-rate" type="number" step="0.05" min="0" max="20" value={rate} onChange={(e) => setRate(e.target.value)} />
              {errors.rate && <span className="form-error">{errors.rate}</span>}
            </div>
            <div className={`form-field ${errors.years ? 'form-field--error' : ''}`}>
              <label htmlFor="c-years">Tenure (years)</label>
              <input id="c-years" type="number" step="0.5" min="0.5" max="10" value={years} onChange={(e) => setYears(e.target.value)} />
              {errors.years && <span className="form-error">{errors.years}</span>}
            </div>
          </div>
          {calc && (
            <div className="result-grid" aria-live="polite">
              <div className="result-box"><span>Total invested</span><strong>{formatINR(calc.invested)}</strong></div>
              <div className="result-box"><span>Estimated interest</span><strong>{formatINR(calc.interest)}</strong></div>
              <div className="result-box result-box--main"><span>Estimated maturity</span><strong>{formatINR(calc.maturity)}</strong></div>
            </div>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
