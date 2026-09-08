import { useState } from 'react';
import {
  Zap,
  Smartphone,
  Wifi,
  Receipt,
  CheckCircle
} from 'lucide-react';
import './BillPayments.css';

const services = [
  {
    id: 'electricity',
    title: 'Electricity Bill',
    icon: Zap,
  },
  {
    id: 'mobile',
    title: 'Mobile Recharge',
    icon: Smartphone,
  },
  {
    id: 'internet',
    title: 'Internet',
    icon: Wifi,
  },
  {
    id: 'other',
    title: 'Other Utilities',
    icon: Receipt,
  },
];

export default function BillPayments() {
  const [selectedService, setSelectedService] =
    useState('electricity');

  const [formData, setFormData] = useState({
    number: '',
    amount: '',
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(
      'fincentral_bill_history'
    );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function makePayment(e) {
    e.preventDefault();

    if (!formData.number || !formData.amount) {
      alert('Please fill all fields.');
      return;
    }

    const service = services.find(
      (s) => s.id === selectedService
    );

    const payment = {
      id: Date.now(),
      service: service.title,
      number: formData.number,
      amount: Number(formData.amount),
      date: new Date().toISOString().slice(0, 10),
      status: 'Successful',
    };

    const updatedHistory = [
      payment,
      ...history,
    ];

    setHistory(updatedHistory);

    localStorage.setItem(
      'fincentral_bill_history',
      JSON.stringify(updatedHistory)
    );

    setFormData({
      number: '',
      amount: '',
    });

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  return (
    <div className="bill-page">

      <div className="bill-header">
        <div>
          <h1>Bill Payments</h1>
          <p>Pay your bills quickly and securely</p>
        </div>
      </div>

      {/* SERVICES */}
      <div className="service-grid">

        {services.map((service) => {

          const Icon = service.icon;

          return (
            <button
              key={service.id}
              className={
                selectedService === service.id
                  ? 'service-card selected'
                  : 'service-card'
              }
              onClick={() =>
                setSelectedService(service.id)
              }
            >

              <div className="service-icon">
                <Icon size={24} />
              </div>

              <strong>{service.title}</strong>

              <span>
                Pay securely
              </span>

            </button>
          );
        })}

      </div>

      {/* PAYMENT */}
      <div className="payment-layout">

        <div className="payment-card">

          <h2>
            {services.find(
              (s) => s.id === selectedService
            )?.title}
          </h2>

          <p>
            Enter the details below to make your payment.
          </p>

          <form onSubmit={makePayment}>

            <label>
              {selectedService === 'mobile'
                ? 'Mobile Number'
                : selectedService === 'electricity'
                  ? 'Consumer Number'
                  : selectedService === 'internet'
                    ? 'Account Number'
                    : 'Reference Number'}
            </label>

            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Enter number"
            />

            <label>Amount</label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="₹ Enter amount"
            />

            <button
              type="submit"
              className="pay-btn"
            >
              Pay Now
            </button>

          </form>

          {success && (
            <div className="success-message">
              <CheckCircle size={18} />
              Payment successful!
            </div>
          )}

        </div>

        {/* HISTORY */}
        <div className="history-card">

          <div className="history-header">
            <h2>Payment History</h2>
            <span>{history.length} payments</span>
          </div>

          {history.length === 0 ? (

            <div className="history-empty">
              <Receipt size={35} />
              <p>No payments yet.</p>
            </div>

          ) : (

            <div className="history-list">

              {history.map((payment) => (

                <div
                  className="history-item"
                  key={payment.id}
                >

                  <div className="history-icon">
                    <Receipt size={18} />
                  </div>

                  <div className="history-info">

                    <strong>
                      {payment.service}
                    </strong>

                    <small>
                      {payment.number} • {payment.date}
                    </small>

                  </div>

                  <div className="history-amount">

                    <strong>
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </strong>

                    <small>
                      {payment.status}
                    </small>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}