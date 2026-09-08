import { useState } from "react";
import {
  Search,
  Download,
  Eye
} from "lucide-react";

import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Card from "../components/Card";
import Button from "../components/Button";

import "./Statement.css";

function Statement() {

  const transactions = [
    {
      id: 1,
      date: "2026-09-01",
      description: "Salary Credit",
      category: "Salary",
      type: "Credit",
      amount: 68000,
      balance: 125450,
      reference: "SAL090126"
    },
    {
      id: 2,
      date: "2026-08-30",
      description: "Grocery Store",
      category: "Shopping",
      type: "Debit",
      amount: 2340,
      balance: 57450,
      reference: "GRC083026"
    },
    {
      id: 3,
      date: "2026-08-28",
      description: "Electricity Bill",
      category: "Utility",
      type: "Debit",
      amount: 1875,
      balance: 59790,
      reference: "ELE082826"
    },
    {
      id: 4,
      date: "2026-08-26",
      description: "Online Shopping",
      category: "Shopping",
      type: "Debit",
      amount: 4520,
      balance: 61665,
      reference: "SHOP082626"
    },
    {
      id: 5,
      date: "2026-08-24",
      description: "Money Transfer - R. Iyer",
      category: "Transfer",
      type: "Debit",
      amount: 12000,
      balance: 66185,
      reference: "TRF082426"
    }
  ];

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter((transaction) => {

    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      type === "All" || transaction.type === type;

    const matchesFromDate =
      !fromDate || transaction.date >= fromDate;

    const matchesToDate =
      !toDate || transaction.date <= toDate;

    return (
      matchesSearch &&
      matchesType &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const openingBalance = 25000;

  const closingBalance =
    filteredTransactions.length > 0
      ? filteredTransactions[0].balance
      : openingBalance;

  const downloadStatement = () => {

    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Balance",
      "Reference"
    ];

    const rows = filteredTransactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount,
      t.balance,
      t.reference
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "fincentral-statement.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AuthenticatedLayout>

      <div className="statement-page">

        <div className="page-header">
          <h1>Bank Statement</h1>
          <p>View and download your transaction history</p>
        </div>

        {/* BALANCE SUMMARY */}

        <div className="balance-grid">

          <Card>
            <span>Opening Balance</span>
            <h2>₹{openingBalance.toLocaleString()}</h2>
          </Card>

          <Card>
            <span>Closing Balance</span>
            <h2>₹{closingBalance.toLocaleString()}</h2>
          </Card>

        </div>

        {/* FILTERS */}

        <Card className="filters-card">

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

          <div className="date-field">
            <label>From</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="date-field">
            <label>To</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <Button onClick={downloadStatement}>
            <Download size={18} />
            Download
          </Button>

        </Card>

        {/* TRANSACTIONS */}

        <Card>

          <div className="statement-heading">
            <h2>Transactions</h2>

            <span>
              {filteredTransactions.length} transactions
            </span>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {filteredTransactions.map((transaction) => (

                  <tr key={transaction.id}>

                    <td>{transaction.date}</td>

                    <td>
                      <strong>{transaction.description}</strong>
                    </td>

                    <td>{transaction.category}</td>

                    <td>
                      <span
                        className={`transaction-type ${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td
                      className={
                        transaction.type === "Credit"
                          ? "credit"
                          : "debit"
                      }
                    >
                      {transaction.type === "Credit"
                        ? "+"
                        : "-"}
                      ₹{transaction.amount.toLocaleString()}
                    </td>

                    <td>
                      ₹{transaction.balance.toLocaleString()}
                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                      >
                        <Eye size={17} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </Card>

        {/* TRANSACTION MODAL */}

        {selectedTransaction && (

          <div className="modal-overlay">

            <div className="transaction-modal">

              <h2>Transaction Details</h2>

              <div className="transaction-details">

                <p>
                  <span>Description</span>
                  <strong>
                    {selectedTransaction.description}
                  </strong>
                </p>

                <p>
                  <span>Date</span>
                  <strong>
                    {selectedTransaction.date}
                  </strong>
                </p>

                <p>
                  <span>Category</span>
                  <strong>
                    {selectedTransaction.category}
                  </strong>
                </p>

                <p>
                  <span>Type</span>
                  <strong>
                    {selectedTransaction.type}
                  </strong>
                </p>

                <p>
                  <span>Amount</span>
                  <strong>
                    ₹{selectedTransaction.amount.toLocaleString()}
                  </strong>
                </p>

                <p>
                  <span>Reference</span>
                  <strong>
                    {selectedTransaction.reference}
                  </strong>
                </p>

              </div>

              <Button
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </Button>

            </div>

          </div>

        )}

      </div>

    </AuthenticatedLayout>
  );
}

export default Statement;