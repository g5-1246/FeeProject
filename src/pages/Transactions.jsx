import React, { useState } from "react";
import AuthenticatedLayout from "../components/AuthenticatedLayout.jsx";
import "./Transactions.css";

export default function Transactions() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const transactions = JSON.parse(
  localStorage.getItem("fincentral_transactions") || "[]"
).map((item) => ({
  date: item.date || "",
  description: item.description || item.name || "Transaction",
  category: item.category || item.name || "Other",
  type: item.type || "Debit",
  amount: Number(item.amount) || 0,
}));

  const filteredTransactions = transactions.filter((item) => {
    const matchesFilter =
      filter === "All" || item.type === filter;

    const matchesSearch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <AuthenticatedLayout>
      <div className="page-fade transactions-page">

        <div className="transactions-heading">
          <h1>Transactions</h1>
          <p>View and manage your recent transactions</p>
        </div>

        
<div className="transaction-summary">
  <div className="transaction-summary-card">
    <span>Total Transactions</span>
    <strong>{transactions.length}</strong>
  </div>

  <div className="transaction-summary-card">
    <span>Total Credits</span>
    <strong className="credit-text">
      ₹{transactions
        .filter((item) => item.type === "Credit")
        .reduce((sum, item) => sum + item.amount, 0)
        .toLocaleString("en-IN")}
    </strong>
  </div>

  <div className="transaction-summary-card">
    <span>Total Debits</span>
    <strong className="debit-text">
      ₹{transactions
        .filter((item) => item.type === "Debit")
        .reduce((sum, item) => sum + item.amount, 0)
        .toLocaleString("en-IN")}
    </strong>
  </div>
</div>


        <div className="transaction-box">

          <div className="transaction-toolbar">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Transactions</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>

          <div className="transaction-table">

            <div className="transaction-table-header">
              <span>Date</span>
              <span>Description</span>
              <span>Category</span>
              <span>Type</span>
              <span>Amount</span>
            </div>

            {filteredTransactions.map((item, index) => (
              <div
                className="transaction-table-row"
                key={index}
              >
                <span>{item.date}</span>

                <span className="transaction-description">
                  {item.description}
                </span>

                <span>{item.category}</span>

                <span
                  className={
                    item.type === "Credit"
                      ? "transaction-credit"
                      : "transaction-debit"
                  }
                >
                  {item.type}
                </span>

                <span
                  className={
                    item.type === "Credit"
                      ? "transaction-credit"
                      : "transaction-debit"
                  }
                >
                  {item.type === "Credit" ? "+" : "-"}₹
                  {item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
