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
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState(() => {
    return JSON.parse(
      localStorage.getItem("fincentral_bill_history") || "[]"
    );
  });

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
    }
  ];

  const handlePayment = (e) => {

    e.preventDefault();

    if (!number || !amount) {
      setMessage("Please enter all details.");
      return;
    }

    const payment = {
      id: Date.now(),
      service,
      number,
      amount: Number(amount),
      date: new Date().toLocaleDateString(),
      status: "Successful"
    };

    const updatedHistory = [
      payment,
      ...history
    ];

    setHistory(updatedHistory);

    localStorage.setItem(
      "fincentral_bill_history",
      JSON.stringify(updatedHistory)
    );

    setNumber("");
    setAmount("");

    setMessage(
      `${service} payment of ₹${amount} was successful.`
    );
  };

  return (
    <AuthenticatedLayout>

      <div className="bill-page">

        <div className="page-header">
          <h1>Bill Payments</h1>
          <p>Pay your bills and recharge services</p>
        </div>

        {/* SERVICES */}

        <div className="service-grid">

          {services.map((item) => (

            <div
              key={item.name}
              className={`service-card ${
                service === item.name ? "selected" : ""
              }`}
              onClick={() => {
                setService(item.name);
                setMessage("");
              }}
            >

              <div className="service-icon">
                {item.icon}
              </div>

              <h3>{item.name}</h3>

              <p>{item.description}</p>

            </div>

          ))}

        </div>

        {/* PAYMENT FORM */}

        <Card className="payment-card">

          <h2>Pay {service}</h2>

          <form onSubmit={handlePayment}>

            <label>
              {service === "Mobile Recharge"
                ? "Mobile Number"
                : "Consumer / Account Number"}
            </label>

            <input
              type="text"
              placeholder="Enter number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <label>Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button type="submit">
              Pay ₹{amount || "0"}
            </Button>

          </form>

          {message && (
            <div className="payment-message">
              {message}
            </div>
          )}

        </Card>

        {/* PAYMENT HISTORY */}

        <Card className="history-card">

          <div className="history-heading">
            <h2>Payment History</h2>
          </div>

          {history.length === 0 ? (

            <p className="empty-history">
              No bill payments yet.
            </p>

          ) : (

            <div className="history-list">

              {history.map((payment) => (

                <div
                  className="history-item"
                  key={payment.id}
                >

                  <div>

                    <strong>
                      {payment.service}
                    </strong>

                    <small>
                      {payment.number}
                    </small>

                  </div>

                  <div>

                    <strong>
                      ₹{payment.amount.toLocaleString()}
                    </strong>

                    <small>
                      {payment.date}
                    </small>

                  </div>

                  <span className="success">
                    {payment.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>

    </AuthenticatedLayout>
  );
}

export default BillPayments;