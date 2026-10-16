import { useState } from 'react';
import { Trash2, Users } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import { getBeneficiaries, addBeneficiary, removeBeneficiary } from '../utils/bankData.js';
import './Banking.css';

const EMPTY = { name: '', nickname: '', accountNumber: '', confirmAccount: '', ifsc: '' };

// view="add" shows the add form first; view="manage" shows the saved list first.
export default function Beneficiaries({ view = 'manage' }) {
  const [list, setList] = useState(getBeneficiaries);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter the account holder’s name.';
    else if (!/^[A-Za-z .'-]+$/.test(form.name.trim())) e.name = 'Name can only contain letters and spaces.';
    if (!/^\d{9,18}$/.test(form.accountNumber)) e.accountNumber = 'Account number must be 9–18 digits.';
    if (form.confirmAccount !== form.accountNumber) e.confirmAccount = 'Account numbers do not match.';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) e.ifsc = 'Enter a valid IFSC (e.g. FCBL0001234).';
    if (list.some((b) => b.accountNumber === form.accountNumber && b.ifsc === form.ifsc.toUpperCase()))
      e.accountNumber = 'This beneficiary is already saved.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    addBeneficiary({
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      accountNumber: form.accountNumber,
      ifsc: form.ifsc.toUpperCase(),
    });
    setList(getBeneficiaries());
    setSaved(`${form.name.trim()} was added to your payees.`);
    setForm(EMPTY);
  }

  function confirmDelete() {
    removeBeneficiary(toDelete.id);
    setList(getBeneficiaries());
    setToDelete(null);
  }

  const field = (id, label, props = {}) => (
    <div className={`form-field ${errors[id] ? 'form-field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={form[id]} onChange={set(id)} {...props} />
      {errors[id] && <span className="form-error">{errors[id]}</span>}
    </div>
  );

  const addCard = (
    <Card key="add" title="Add Beneficiary" subtitle="Details are stored only in this browser (demo).">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {field('name', 'Account holder name', { autoComplete: 'off' })}
          {field('nickname', 'Nickname (optional)', { maxLength: 24 })}
          {field('accountNumber', 'Account number', { inputMode: 'numeric', autoComplete: 'off' })}
          {field('confirmAccount', 'Confirm account number', { inputMode: 'numeric', autoComplete: 'off' })}
          {field('ifsc', 'IFSC code', { maxLength: 11, style: { textTransform: 'uppercase' } })}
        </div>
        {saved && <div className="demo-notice demo-notice--ok" role="status" style={{ marginTop: 16 }}>{saved}</div>}
        <div className="form-actions"><Button type="submit">Save Beneficiary</Button></div>
      </form>
    </Card>
  );

  const listCard = (
    <Card key="list" title="Saved Payees" subtitle={`${list.length} saved`} padded={false}>
      {list.length === 0 ? (
        <EmptyState icon={Users} title="No payees saved" description="Beneficiaries you add will appear here." />
      ) : (
        <ul className="banking-list">
          {list.map((b) => (
            <li key={b.id} className="banking-list__item">
              <span className="banking-list__avatar">{b.name.slice(0, 2).toUpperCase()}</span>
              <div className="banking-list__main">
                <p className="banking-list__title">{b.name}{b.nickname ? ` (${b.nickname})` : ''}</p>
                <p className="banking-list__sub figure">••••{b.accountNumber.slice(-4)} · {b.ifsc}</p>
              </div>
              <button className="icon-btn" aria-label={`Remove ${b.name}`} onClick={() => setToDelete(b)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <div className="page-fade banking-page banking-narrow">
        <PageHeader
          title={view === 'add' ? 'Add Beneficiary' : 'Manage Payees'}
          subtitle="Add and manage the people and businesses you pay."
        />
        {view === 'add' ? [addCard, listCard] : [listCard, addCard]}
      </div>
      <Modal
        open={!!toDelete}
        title="Remove payee"
        message={toDelete ? `Remove ${toDelete.name} from your saved payees?` : ''}
        onClose={() => setToDelete(null)}
        actions={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Remove</Button>
          </>
        }
      />
    </AuthenticatedLayout>
  );
}
