
import { useState } from "react";
import {
  Zap,
  Smartphone,
  Wifi,
  Receipt
} from "lucide-react";

import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Card from "../components/Card";
import Button from "../components/Button";

import "./BillPayments.css";

function BillPayments() {
  const [service, setService] = useState("Electricity");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [taxType, setTaxType] = useState("GST");
  const [taxCategory, setTaxCategory] = useState("Income Tax");
const [assessmentPeriod, setAssessmentPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [showGSTOnly, setShowGSTOnly] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTransactionId, setSearchTransactionId] = useState("");
const [statusResult, setStatusResult] = useState(null);

  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("fincentral_bill_history") || "[]")
  );

  const services = [
    {
      name: "Electricity",
      icon: <Zap size={30} />,
      description: "Pay your electricity bill"
    },
    {
      name: "Mobile Recharge",
      icon: <Smartphone size={30} />,
      description: "Recharge your mobile"
    },
    {
      name: "Internet",
      icon: <Wifi size={30} />,
      description: "Pay internet bill"
    },
    {
      name: "Other Utilities",
      icon: <Receipt size={30} />,
      description: "Pay other utility bills"
    },
    {
      name: "GST Payment",
      icon: <Receipt size={30} />,
      description: "Pay GST and other taxes"
    },

{
  name: "Online Tax Payment",
  icon: <Receipt size={30} />,
  description: "Pay income tax and other taxes"
}
  ];

  const gstPayments = history.filter(
    (payment) => payment.service === "GST Payment"
  );

  const totalGSTPaid = gstPayments
    .filter((payment) => payment.status === "Successful")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const handlePayment = (e) => {
    e.preventDefault();

    if (!number.trim() || !amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter valid details and an amount greater than zero.");
      return;
    }

    if (
      service === "GST Payment" &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        number.trim().toUpperCase()
      )
    ) {
      setMessage("Please enter a valid GSTIN.");
      return;
    }

    const payment = {
      id: Date.now(),
      service,
      number: service === "GST Payment"
        ? number.trim().toUpperCase()
        : number.trim(),
      amount: Number(amount),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Successful",
      transactionId: `TXN${Date.now()}`,
      taxType: service === "GST Payment" ? taxType : "",
      taxCategory:
  service === "Online Tax Payment" ? taxCategory : "",
assessmentPeriod:
  service === "Online Tax Payment" ? assessmentPeriod : "",
    };

    const updatedHistory = [payment, ...history];

    setHistory(updatedHistory);

    localStorage.setItem(
      "fincentral_bill_history",
      JSON.stringify(updatedHistory)
    );

    const transaction = {
      id: payment.id,
      name:
  service === "GST Payment"
    ? `${taxType} Payment`
    : service === "Online Tax Payment"
      ? `${taxCategory} Payment`
      : service,
      date: payment.date,
      type: "Debit",
      amount: payment.amount,
      status: "Completed"
    };

    const transactions = JSON.parse(
      localStorage.getItem("fincentral_transactions") || "[]"
    );

    localStorage.setItem(
      "fincentral_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    const totalBalance = Number(
      localStorage.getItem("fincentral_total_balance") || 125450
    );

    const availableBalance = Number(
      localStorage.getItem("fincentral_available_balance") || 98450
    );

    const savingsBalance = Number(
      localStorage.getItem("fincentral_savings_balance") || 42310
    );

    localStorage.setItem(
      "fincentral_total_balance",
      totalBalance - payment.amount
    );

    localStorage.setItem(
      "fincentral_available_balance",
      availableBalance - payment.amount
    );

    localStorage.setItem(
      "fincentral_savings_balance",
      savingsBalance - payment.amount
    );

    setNumber("");
    setAmount("");
    setAssessmentPeriod("");
    setMessage(`${service} payment of ₹${payment.amount.toLocaleString("en-IN")} was successful.`);

    if (["GST Payment", "Online Tax Payment"].includes(service)) {
  setSelectedReceipt(payment);
}
  };
const checkGSTStatus = () => {
  if (!searchTransactionId.trim()) {
    setStatusResult({ error: true });
    return;
  }

  const result = history.find(
    
    (payment) =>
      ["GST Payment", "Online Tax Payment"].includes(payment.service) &&
      (payment.transactionId || String(payment.id)).toLowerCase() ===
        searchTransactionId.trim().toLowerCase()
  );

  setStatusResult(result || { notFound: true });
};

  const visibleHistory = history.filter((payment) =>
    showGSTOnly
      ? payment.service === "GST Payment"
      : true
  );

  return (
    <AuthenticatedLayout>
      <div className="bill-page">
        <div className="page-header">
          <h1>Bill Payments</h1>
          <p>Pay your bills, GST and other taxes</p>
        </div>

        {service === "GST Payment" && (
          <div className="transaction-summary">
            <div className="transaction-summary-card">
              <span>Total GST Payments</span>
              <strong>{gstPayments.length}</strong>
            </div>

            <div className="transaction-summary-card">
              <span>Total Successful Payments</span>
              <strong>
                {gstPayments.filter(
                  (payment) => payment.status === "Successful"
                ).length}
              </strong>
            </div>

            <div className="transaction-summary-card">
              <span>Total Amount Paid</span>
              <strong>₹{totalGSTPaid.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        )}
<Card className="payment-card">
  <h2>Check Tax Payment Status</h2>

  <label>Transaction ID</label>
  <input
    type="text"
    placeholder="Enter transaction ID"
    value={searchTransactionId}
    onChange={(e) => {
      setSearchTransactionId(e.target.value);
      setStatusResult(null);
    }}
  />

  <Button type="button" onClick={checkGSTStatus}>
    Check Status
  </Button>

  
{statusResult && (
  <div className="payment-message">
    {statusResult.error ? (
      <p>Please enter a transaction ID.</p>
    ) : statusResult.notFound ? (
      <p>No tax payment found for this transaction ID.</p>
    ) : (
      <>
        <p>
          <strong>Status:</strong> {statusResult.status}
        </p>
        <p>
          <strong>Transaction ID:</strong>{" "}
          {statusResult.transactionId || statusResult.id}
        </p>
        <p>
          <strong>Amount:</strong> ₹
          {Number(statusResult.amount).toLocaleString("en-IN")}
        </p>
        <p>
          <strong>Date:</strong> {statusResult.date}
        </p>
      </>
    )}
  </div>
)}

</Card>

        <div className="service-grid">
          {services.map((item) => (
            <div
              key={item.name}
              className={`service-card ${service === item.name ? "selected" : ""}`}
              onClick={() => {
                setService(item.name);
                setMessage("");
              }}
            >
              <div className="service-icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <Card className="payment-card">
          <h2>Pay {service}</h2>
<form onSubmit={handlePayment}>
  {service === "GST Payment" && (
    <>
      <label>Tax Type</label>
      <select
        value={taxType}
        onChange={(e) => setTaxType(e.target.value)}
      >
        <option value="GST">Goods and Services Tax (GST)</option>
        <option value="CGST">Central GST (CGST)</option>
        <option value="SGST">State GST (SGST)</option>
        <option value="IGST">Integrated GST (IGST)</option>
        <option value="Other Tax">Other Tax</option>
      </select>

      <p className="tax-payment-info">
        Select the applicable tax type before making your payment.
      </p>
    </>
  )}
  
{service === "Online Tax Payment" && (
  <>
    <label>Tax Category</label>
    <select
      value={taxCategory}
      onChange={(e) => setTaxCategory(e.target.value)}
    >
      <option value="Income Tax">Income Tax</option>
      <option value="Property Tax">Property Tax</option>
      <option value="Professional Tax">Professional Tax</option>
      <option value="Other Tax">Other Tax</option>
    </select>

    <label>Assessment Period / Financial Year</label>
    <input
      type="text"
      placeholder="e.g. 2026-27"
      value={assessmentPeriod}
      onChange={(e) => setAssessmentPeriod(e.target.value)}
      required
    />

    <p className="tax-payment-info">
      Demo only. This does not submit tax to a government portal.
    </p>
  </>
)}


            <label>
              {service === "Mobile Recharge"
  ? "Mobile Number"
  : service === "GST Payment"
    ? "GSTIN / Taxpayer Number"
    : service === "Online Tax Payment"
      ? "PAN / Taxpayer Number"
      : "Consumer / Account Number"}
            </label>

            <input
              type="text"
              placeholder={
                service === "GST Payment"
                  ? "Enter 15-character GSTIN"
                  : "Enter number"
              }
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />

            <label>Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <Button type="submit">
              Pay ₹{amount || "0"}
            </Button>
          </form>

          {message && (
            <div className="payment-message">{message}</div>
          )}
        </Card>

        <Card className="history-card">
          <div className="history-heading">
            <h2>
              {showGSTOnly
                ? "GST & Tax Payment History"
                : "Payment History"}
            </h2>

            <button
              type="button"
              onClick={() => setShowGSTOnly((current) => !current)}
            >
              {showGSTOnly ? "View All Bills" : "View GST Payments"}
            </button>
          </div>

          {visibleHistory.length === 0 ? (
            <p className="empty-history">
              {showGSTOnly
                ? "No GST payments recorded yet."
                : "No bill payments yet."}
            </p>
          ) : (
            <div className="history-list">
{visibleHistory.map((payment) => (
  <div className="history-item" key={payment.id}>
    <div>
      <strong>{payment.service}</strong>
      <small>{payment.number}</small>

      {payment.service === "GST Payment" && (
        <small>Tax Type: {payment.taxType || "GST"}</small>
      )}

      {payment.service === "Online Tax Payment" && (
        <>
          <small>Tax Category: {payment.taxCategory}</small>
          <small>Assessment Period: {payment.assessmentPeriod}</small>
        </>
      )}
    </div>

    <div>
      <strong>₹{Number(payment.amount).toLocaleString("en-IN")}</strong>
      <small>{payment.date}</small>

      {["GST Payment", "Online Tax Payment"].includes(payment.service) && (
        <small>
          Transaction ID: {payment.transactionId || payment.id}
        </small>
      )}
    </div>

    <span className="success">{payment.status}</span>

    {["GST Payment", "Online Tax Payment"].includes(payment.service) && (
      <button
        type="button"
        onClick={() => setSelectedReceipt(payment)}
      >
        View Receipt
      </button>
    )}
  </div>
  ))}
</div>
          )}
</Card>

        {selectedReceipt && (
          <Card className="history-card">
            <div className="history-heading">
              <h2>
  {selectedReceipt.service === "Online Tax Payment"
    ? "Online Tax Payment Receipt"
    : "GST Payment Receipt"}
</h2>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
              >
                Close Receipt
              </button>
            </div>

            <div className="receipt-details">
  <p>
    <strong>Transaction ID:</strong>{" "}
    {selectedReceipt.transactionId || selectedReceipt.id}
  </p>

  {selectedReceipt.service === "Online Tax Payment" ? (
    <>
      <p><strong>Tax Category:</strong> {selectedReceipt.taxCategory}</p>
      <p><strong>Assessment Period:</strong> {selectedReceipt.assessmentPeriod}</p>
      <p><strong>Taxpayer Number:</strong> {selectedReceipt.number}</p>
    </>
  ) : (
    <>
      <p><strong>Tax Type:</strong> {selectedReceipt.taxType || "GST"}</p>
      <p><strong>GSTIN:</strong> {selectedReceipt.number}</p>
    </>
  )}

  <p>
    <strong>Amount:</strong>{" "}
    ₹{Number(selectedReceipt.amount).toLocaleString("en-IN")}
  </p>
  <p><strong>Date:</strong> {selectedReceipt.date}</p>
  <p><strong>Status:</strong> {selectedReceipt.status}</p>
  <p>
    <small>
      This is a demo receipt, not an official tax payment confirmation.
    </small>
  </p>
</div>

            <button type="button" onClick={() => window.print()}>
              Print Receipt
            </button>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

export default BillPayments;
