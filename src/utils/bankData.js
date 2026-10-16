// Shared localStorage helpers for the Pay & Transfer and Deposits features.
// New keys are namespaced "fincentral_*" like the rest of the app and do not
// overlap with any existing key. Nothing here moves real money: this is a
// frontend-only project, so transfers are stored as demo requests only.

const BENEFICIARIES_KEY = 'fincentral_beneficiaries';
const TRANSFERS_KEY = 'fincentral_transfer_history';
const DEPOSITS_KEY = 'fincentral_deposits';

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Balances (existing keys, same defaults as the Dashboard) ---------- */

export function getBalances() {
  return {
    total: Number(localStorage.getItem('fincentral_total_balance') || 125450),
    available: Number(localStorage.getItem('fincentral_available_balance') || 98450),
    savings: Number(localStorage.getItem('fincentral_savings_balance') || 42310),
  };
}

/* ---------- Beneficiaries ---------- */

export const getBeneficiaries = () => read(BENEFICIARIES_KEY);

export function addBeneficiary(data) {
  const list = getBeneficiaries();
  const entry = { id: Date.now(), ...data, addedOn: new Date().toISOString() };
  write(BENEFICIARIES_KEY, [entry, ...list]);
  return entry;
}

export function removeBeneficiary(id) {
  write(BENEFICIARIES_KEY, getBeneficiaries().filter((b) => b.id !== id));
}

/* ---------- Transfers (demo requests only) ---------- */

export const getTransfers = () => read(TRANSFERS_KEY);

export function addTransferRequest(data) {
  const entry = {
    id: Date.now(),
    ...data,
    createdOn: new Date().toISOString(),
    status: 'Demo request',
  };
  write(TRANSFERS_KEY, [entry, ...getTransfers()]);
  return entry;
}

/* ---------- Deposits ---------- */

export const getDeposits = () => read(DEPOSITS_KEY);

/* ---------- Demo deposit rates (NOT real bank rates) ---------- */

export const DEMO_RATES = {
  fd: [
    { years: 1, rate: 6.5 },
    { years: 2, rate: 6.75 },
    { years: 3, rate: 7.0 },
    { years: 5, rate: 6.9 },
  ],
  rd: [
    { years: 1, rate: 6.25 },
    { years: 2, rate: 6.5 },
    { years: 3, rate: 6.75 },
    { years: 5, rate: 6.8 },
  ],
};

// Fixed deposit: quarterly compounding.
export function fdMaturity(principal, annualRate, years) {
  const p = Number(principal);
  const r = Number(annualRate) / 100;
  const t = Number(years);
  if (!(p > 0) || !(r >= 0) || !(t > 0)) return { maturity: 0, interest: 0, invested: 0 };
  const maturity = p * Math.pow(1 + r / 4, 4 * t);
  return { maturity, interest: maturity - p, invested: p };
}

// Recurring deposit: monthly instalments, quarterly compounding.
export function rdMaturity(monthly, annualRate, years) {
  const m = Number(monthly);
  const r = Number(annualRate) / 100;
  const months = Math.round(Number(years) * 12);
  if (!(m > 0) || !(r >= 0) || !(months > 0)) return { maturity: 0, interest: 0, invested: 0 };
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    maturity += m * Math.pow(1 + r / 4, (4 * (months - i + 1)) / 12);
  }
  const invested = m * months;
  return { maturity, interest: maturity - invested, invested };
}

/* ---------- Spending categories (derived from existing transactions) ---------- */

const CATEGORY_RULES = [
  ['Utilities', /electric|water|gas|internet|wifi|broadband|utilit|recharge|mobile|bill/i],
  ['Groceries', /grocer|supermarket|mart|vegetable|food|restaurant|swiggy|zomato/i],
  ['Shopping', /shop|amazon|flipkart|store|purchase/i],
  ['Transfers', /transfer|sent|payee|upi/i],
];

export function categorize(name = '') {
  const hit = CATEGORY_RULES.find(([, re]) => re.test(name));
  return hit ? hit[0] : 'Other';
}

export function spendingByCategory(transactions) {
  const totals = {};
  transactions
    .filter((t) => (t.type || '').toLowerCase() === 'debit')
    .forEach((t) => {
      const cat = categorize(t.name || t.description);
      totals[cat] = (totals[cat] || 0) + (Number(t.amount) || 0);
    });
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
