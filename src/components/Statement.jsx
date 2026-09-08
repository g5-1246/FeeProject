import { useMemo, useState } from 'react';
import {
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  X
} from 'lucide-react';
import './Statement.css';

const transactions = [
  {
    id: 1,
    date: '2026-09-05',
    description: 'Salary Credit',
    category: 'Income',
    type: 'Credit',
    amount: 55000,
    balance: 74250,
    reference: 'SAL20260905',
  },
  {
    id: 2,
    date: '2026-09-04',
    description: 'Electricity Bill',
    category: 'Utilities',
    type: 'Debit',
    amount: 2450,
    balance: 19250,
    reference: 'EB20260904',
  },
  {
    id: 3,
    date: '2026-09-03',
    description: 'Amazon Purchase',
    category: 'Shopping',
    type: 'Debit',
    amount: 3299,
    balance: 21700,
    reference: 'AMZ20260903',
  },
  {
    id: 4,
    date: '2026-09-02',
    description: 'UPI Transfer Received',
    category: 'Transfer',
    type: 'Credit',
    amount: 5000,
    balance: 24999,
    reference: 'UPI20260902',
  },
  {
    id: 5,
    date: '2026-09-01',
    description: 'Mobile Recharge',
    category: 'Utilities',
    type: 'Debit',
    amount: 799,
    balance: 19999,
    reference: 'MOB20260901',
  },
];

export default function Statement() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selected, setSelected] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchMatch =
        transaction.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.reference
          .toLowerCase()
          .includes(search.toLowerCase());

      const typeMatch =
        type === 'All' || transaction.type === type;

      const fromMatch =
        !fromDate || transaction.date >= fromDate;

      const toMatch =
        !toDate || transaction.date <= toDate;

      return (
        searchMatch &&
        typeMatch &&
        fromMatch &&
        toMatch
      );
    });
  }, [search, type, fromDate, toDate]);

  const openingBalance = 25000;

  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[0].balance
      : openingBalance;

  function downloadStatement() {
    const headers =
      'Date,Description,Category,Type,Amount,Balance,Reference\n';

    const rows = filteredTransactions
      .map((t) =>
        `${t.date},"${t.description}",${t.category},${t.type},${t.amount},${t.balance},${t.reference}`
      )
      .join('\n');

    const blob = new Blob(
      [headers + rows],
      { type: 'text/csv' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'fincentral-bank-statement.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="statement-page">

      <div className="statement-header">
        <div>
          <h1>Bank Statement</h1>
          <p>View and manage your account transactions</p>
        </div>

        <button
          className="download-btn"
          onClick={downloadStatement}
        >
          <Download size={18} />
          Download Statement
        </button>
      </div>

      {/* BALANCE */}
      <div className="balance-grid">

        <div className="balance-card">
          <span>Opening Balance</span>
          <strong>₹25,000.00</strong>
        </div>

        <div className="balance-card">
          <span>Closing Balance</span>
          <strong>
            ₹{closingBalance.toLocaleString('en-IN')}.00
          </strong>
        </div>

        <div className="balance-card">
          <span>Transactions</span>
          <strong>{filteredTransactions.length}</strong>
        </div>

      </div>

      {/* FILTERS */}
      <div className="filters">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">All Transactions</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

      </div>

      {/* TABLE */}
      <div className="statement-table">

        <div className="table-head">
          <span>Date</span>
          <span>Transaction</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Balance</span>
          <span></span>
        </div>

        {filteredTransactions.map((transaction) => (

          <div
            className="table-row"
            key={transaction.id}
          >

            <span>
              {new Date(transaction.date)
                .toLocaleDateString('en-IN')}
            </span>

            <div className="transaction-name">

              <div className={`transaction-icon ${transaction.type.toLowerCase()}`}>
                {transaction.type === 'Credit'
                  ? <ArrowDownLeft size={17} />
                  : <ArrowUpRight size={17} />}
              </div>

              <div>
                <strong>
                  {transaction.description}
                </strong>

                <small>
                  {transaction.reference}
                </small>
              </div>

            </div>

            <span
              className={
                transaction.type === 'Credit'
                  ? 'credit'
                  : 'debit'
              }
            >
              {transaction.type}
            </span>

            <strong>
              {transaction.type === 'Credit'
                ? '+'
                : '-'}
              ₹{transaction.amount.toLocaleString('en-IN')}
            </strong>

            <span>
              ₹{transaction.balance.toLocaleString('en-IN')}
            </span>

            <button
              className="details-btn"
              onClick={() =>
                setSelected(transaction)
              }
            >
              Details
            </button>

          </div>

        ))}

        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            No transactions found.
          </div>
        )}

      </div>

      {/* MODAL */}
      {selected && (

        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >

          <div
            className="transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <h2>Transaction Details</h2>

              <button
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="transaction-detail-box">

              <h3>{selected.description}</h3>

              <div>
                <span>Date</span>
                <strong>{selected.date}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selected.category}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{selected.type}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  ₹{selected.amount.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span>Balance</span>
                <strong>
                  ₹{selected.balance.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span>Reference</span>
                <strong>{selected.reference}</strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}