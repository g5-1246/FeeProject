import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, CreditCard } from "lucide-react";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import "./Cards.css";

function Cards() {
  const [showNumber, setShowNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  
  const [replacementRequests, setReplacementRequests] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("fincentral_card_replacements") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [requestMessage, setRequestMessage] = useState("");
  const [replacementReason, setReplacementReason] = useState("Damaged card");


  const [status, setStatus] = useState(
    localStorage.getItem("fincentral_card_status") || "Active"
  );

  const cardNumber = "4521 7845 9632 1087";

  const toggleCard = () => {
    const newStatus = status === "Active" ? "Blocked" : "Active";

    setStatus(newStatus);
    localStorage.setItem("fincentral_card_status", newStatus);
  };

  const requestReplacement = (e) => {
    e.preventDefault();

    const request = {
      id: `CARD${Date.now()}`,
      reason: replacementReason,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };

    const updated = [request, ...replacementRequests];

    localStorage.setItem(
      "fincentral_card_replacements",
      JSON.stringify(updated)
    );

    setReplacementRequests(updated);
    setRequestMessage("Card replacement request submitted successfully.");
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
                <strong> HARSHITA</strong>
              </div>

              <div>
                <small>VALID THRU</small>
                <strong> 09/29</strong>
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

        <Card className="security-card">
          <h2>Request Card Replacement</h2>

          {requestMessage && (
            <p role="status">{requestMessage}</p>
          )}

          <form onSubmit={requestReplacement}>
            <label htmlFor="replacement-reason">
              Reason for replacement
            </label>

            <select
              id="replacement-reason"
              value={replacementReason}
              onChange={(e) => setReplacementReason(e.target.value)}
            >
              <option>Damaged card</option>
              <option>Lost card</option>
              <option>Card not working</option>
              <option>Other</option>
            </select>

            <Button type="submit">
              Submit Replacement Request
            </Button>
          </form>

          <h2>Replacement Request History</h2>

          {replacementRequests.length === 0 ? (
            <p>No replacement requests yet.</p>
          ) : (
            replacementRequests.map((request) => (
              <div className="detail-row" key={request.id}>
                <div>
                  <strong>{request.reason}</strong>
                  <p>Request ID: {request.id}</p>
                  <small>{request.date}</small>
                </div>

                <span className={`status ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
            ))
          )}
        </Card>

      </div>
    </AuthenticatedLayout>
  );
}

export default Cards;
