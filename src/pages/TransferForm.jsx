import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, CheckCircle2, UserPlus } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatINR } from '../utils/format.js';
import { getBeneficiaries, getBalances, addTransferRequest } from '../utils/bankData.js';
import './Banking.css';

// One controlled form powers both "Send Money" (mode="send") and
// "Quick Pay" (mode="quick", fewer fields). It never moves money or edits
// balances — it records a clearly labelled demo request.
export default function TransferForm({ mode = 'send' }) {
  const quick = mode === 'quick';
  const beneficiaries = getBeneficiaries();
  const { available } = getBalances();

  const [payeeId, setPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [method, setMethod] = useState('IMPS');
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(false);
  const [done, setDone] = useState(null);

  const payee = beneficiaries.find((b) => String(b.id) === String(payeeId));

  function validate() {
    const e = {};
    if (!payee) e.payee = 'Select a payee.';
    const n = Number(amount);
    if (!amount) e.amount = 'Enter an amount.';
    else if (!(n > 0)) e.amount = 'Amount must be greater than zero.';
    else if (Math.round(n * 100) !== n * 100) e.amount = 'Use at most two decimal places.';
    else if (n > available) e.amount = `Amount exceeds your available balance (${formatINR(available)}).`;
    if (remark.length > 50) e.remark = 'Remark can be at most 50 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleReview(ev) {
    ev.preventDefault();
    if (validate()) setReview(true);
  }

  function handleConfirm() {
    const entry = addTransferRequest({
      payeeName: payee.name,
      accountLast4: String(payee.accountNumber).slice(-4),
      amount: Number(amount),
      remark: remark.trim(),
      method: quick ? 'Quick Pay' : method,
    });
    setDone(entry);
  }

  const title = quick ? 'Quick Pay' : 'Send Money';

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader
          title={title}
          subtitle={quick ? 'Pay a saved payee in a few taps.' : 'Transfer to a saved beneficiary.'}
        />

        <div className="demo-notice">
          <Info size={16} aria-hidden="true" />
          <span>Demo only: submitting records a request. No money is sent and balances stay unchanged.</span>
        </div>

        {done ? (
          <Card>
            <div className="demo-notice demo-notice--ok">
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>
                Demo request saved for <strong>{done.payeeName}</strong> — {formatINR(done.amount)}. No actual
                transfer was made.
              </span>
            </div>
            <div className="form-actions">
              <Link to="/transfer-history" className="btn-link">View Transfer History</Link>
              <Link to="/dashboard" className="btn-link btn-link--outline">Back to Dashboard</Link>
            </div>
          </Card>
        ) : beneficiaries.length === 0 ? (
          <Card>
            <EmptyState
              icon={UserPlus}
              title="No payees yet"
              description="Add a beneficiary first, then come back to make a payment."
              action={<Link to="/beneficiaries/add" className="btn-link">Add Beneficiary</Link>}
            />
          </Card>
        ) : (
          <Card title={review ? 'Review details' : 'Payment details'}>
            {!review ? (
              <form onSubmit={handleReview} noValidate>
                <div className="form-grid">
                  <div className={`form-field form-field--full ${errors.payee ? 'form-field--error' : ''}`}>
                    <label htmlFor="payee">Payee</label>
                    {quick ? (
                      <div className="payee-chips" role="group" aria-label="Choose payee">
                        {beneficiaries.map((b) => (
                          <button
                            type="button"
                            key={b.id}
                            className={`payee-chip ${String(b.id) === String(payeeId) ? 'payee-chip--on' : ''}`}
                            onClick={() => setPayeeId(b.id)}
                          >
                            {b.nickname || b.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <select id="payee" value={payeeId} onChange={(e) => setPayeeId(e.target.value)}>
                        <option value="">Select a beneficiary</option>
                        {beneficiaries.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} — ••••{String(b.accountNumber).slice(-4)}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.payee && <span className="form-error">{errors.payee}</span>}
                  </div>

                  <div className={`form-field ${errors.amount ? 'form-field--error' : ''}`}>
                    <label htmlFor="amount">Amount (₹)</label>
                    <input
                      id="amount" type="number" inputMode="decimal" min="0" step="0.01"
                      value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                    />
                    {errors.amount ? (
                      <span className="form-error">{errors.amount}</span>
                    ) : (
                      <span className="form-hint">Available: {formatINR(available)}</span>
                    )}
                  </div>

                  {!quick && (
                    <div className="form-field">
                      <label htmlFor="method">Transfer mode</label>
                      <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option>IMPS</option>
                        <option>NEFT</option>
                        <option>RTGS</option>
                      </select>
                    </div>
                  )}

                  <div className={`form-field form-field--full ${errors.remark ? 'form-field--error' : ''}`}>
                    <label htmlFor="remark">Remark (optional)</label>
                    <input id="remark" type="text" value={remark} maxLength={60}
                      onChange={(e) => setRemark(e.target.value)} placeholder="e.g. Rent" />
                    {errors.remark && <span className="form-error">{errors.remark}</span>}
                  </div>
                </div>
                <div className="form-actions">
                  <Button type="submit">Review</Button>
                </div>
              </form>
            ) : (
              <>
                <dl className="summary-list review-box">
                  <div className="summary-list__row"><dt>To</dt><dd>{payee.name}</dd></div>
                  <div className="summary-list__row"><dt>Account</dt><dd className="figure">••••{String(payee.accountNumber).slice(-4)}</dd></div>
                  <div className="summary-list__row"><dt>Amount</dt><dd className="figure">{formatINR(amount)}</dd></div>
                  <div className="summary-list__row"><dt>Mode</dt><dd>{quick ? 'Quick Pay' : method}</dd></div>
                  {remark && <div className="summary-list__row"><dt>Remark</dt><dd>{remark}</dd></div>}
                </dl>
                <div className="form-actions">
                  <Button onClick={handleConfirm}>Save Demo Request</Button>
                  <Button variant="outline" onClick={() => setReview(false)}>Edit</Button>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
