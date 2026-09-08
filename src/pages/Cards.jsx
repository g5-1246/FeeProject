import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, CreditCard } from "lucide-react";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import "./Cards.css";

function Cards() {
  const [showNumber, setShowNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const [status, setStatus] = useState(
    localStorage.getItem("fincentral_card_status") || "Active"
  );

  const cardNumber = "4521 7845 9632 1087";

  const toggleCard = () => {
    const newStatus = status === "Active" ? "Blocked" : "Active";

    setStatus(newStatus);
    localStorage.setItem("fincentral_card_status", newStatus);
  };

  return (
    <AuthenticatedLayout>
      <div className="cards-page">

        <div className="page-header">
          <div>
            <h1>My Cards</h1>
            <p>Manage your debit and credit cards</p>
          </div>
        </div>

        <div className="cards-grid">

          {/* Debit Card */}
          <div className="bank-card">

            <div className="card-top">
              <span>FINCENTRAL BANK</span>
              <CreditCard size={32} />
            </div>

            <div className="chip"></div>

            <div className="card-number">
              {showNumber ? cardNumber : "4521 •••• •••• 1087"}
            </div>

            <div className="card-bottom">
              <div>
                <small>CARD HOLDER</small>
                <strong>MAYANK GARG</strong>
              </div>

              <div>
                <small>VALID THRU</small>
                <strong>09/29</strong>
              </div>
            </div>

          </div>

          {/* Card Details */}
          <Card>
            <div className="card-details-header">
              <h2>Debit Card</h2>

              <span className={`status ${status.toLowerCase()}`}>
                {status}
              </span>
            </div>

            <div className="detail-row">
              <span>Card Number</span>

              <strong>
                {showNumber ? cardNumber : "4521 •••• •••• 1087"}

                <button
                  className="icon-btn"
                  onClick={() => setShowNumber(!showNumber)}
                >
                  {showNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </strong>
            </div>

            <div className="detail-row">
              <span>Card Type</span>
              <strong>Debit Card</strong>
            </div>

            <div className="detail-row">
              <span>Expiry Date</span>
              <strong>09/29</strong>
            </div>

            <div className="detail-row">
              <span>CVV</span>

              <strong>
                {showCvv ? "421" : "•••"}

                <button
                  className="icon-btn"
                  onClick={() => setShowCvv(!showCvv)}
                >
                  {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </strong>
            </div>

            <Button
              onClick={toggleCard}
              variant={status === "Active" ? "secondary" : "primary"}
            >
              {status === "Active" ? (
                <>
                  <Lock size={18} />
                  Block Card
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Unblock Card
                </>
              )}
            </Button>

          </Card>

        </div>

        {/* Card Status */}
        <Card className="security-card">
          <h2>Card Security</h2>

          <p>
            Your card is currently{" "}
            <strong>{status.toLowerCase()}</strong>.
            You can block your card temporarily if you notice
            suspicious activity.
          </p>
        </Card>

      </div>
    </AuthenticatedLayout>
  );
}

export default Cards;