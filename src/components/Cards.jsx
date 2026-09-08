import { useState } from 'react';
import { CreditCard, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import './Cards.css';

const DEFAULT_CARD = {
  type: 'Debit Card',
  number: '4582  XXXX  XXXX  7821',
  holder: 'Harshita Sharma',
  expiry: '08/29',
  cvv: '***',
  status: 'Active',
};

export default function Cards() {
  const [card, setCard] = useState(DEFAULT_CARD);
  const [showNumber, setShowNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  function toggleCard() {
    const newStatus = card.status === 'Active' ? 'Blocked' : 'Active';

    setCard((prev) => ({
      ...prev,
      status: newStatus,
    }));

    localStorage.setItem(
      'fincentral_card_status',
      newStatus
    );
  }

  const storedStatus = localStorage.getItem('fincentral_card_status');

  if (storedStatus && card.status === 'Active' && storedStatus === 'Blocked') {
    card.status = 'Blocked';
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Cards</h1>
          <p>Manage your debit and credit cards</p>
        </div>
      </div>

      <div className="cards-grid">

        {/* CARD */}
        <div className={`bank-card ${card.status === 'Blocked' ? 'bank-card--blocked' : ''}`}>
          <div className="bank-card__top">
            <div>
              <span className="bank-card__bank">
                FINCENTRAL BANK
              </span>
              <span className="bank-card__type">
                {card.type}
              </span>
            </div>

            <CreditCard size={34} />
          </div>

          <div className="bank-card__number">
            {showNumber
              ? '4582 9145 6231 7821'
              : card.number}
          </div>

          <div className="bank-card__bottom">
            <div>
              <small>CARD HOLDER</small>
              <strong>{card.holder}</strong>
            </div>

            <div>
              <small>VALID THRU</small>
              <strong>{card.expiry}</strong>
            </div>
          </div>

          {card.status === 'Blocked' && (
            <div className="blocked-overlay">
              CARD BLOCKED
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="card-details card-panel">
          <div className="panel-title">
            <h2>Card Details</h2>

            <span
              className={
                card.status === 'Active'
                  ? 'status active'
                  : 'status blocked'
              }
            >
              {card.status}
            </span>
          </div>

          <div className="details-list">

            <div className="detail-row">
              <span>Card Type</span>
              <strong>{card.type}</strong>
            </div>

            <div className="detail-row">
              <span>Card Number</span>
              <strong>
                {showNumber
                  ? '4582 9145 6231 7821'
                  : 'XXXX XXXX XXXX 7821'}

                <button
                  className="icon-btn"
                  onClick={() => setShowNumber(!showNumber)}
                >
                  {showNumber
                    ? <EyeOff size={17} />
                    : <Eye size={17} />}
                </button>
              </strong>
            </div>

            <div className="detail-row">
              <span>CVV</span>
              <strong>
                {showCvv ? '428' : '***'}

                <button
                  className="icon-btn"
                  onClick={() => setShowCvv(!showCvv)}
                >
                  {showCvv
                    ? <EyeOff size={17} />
                    : <Eye size={17} />}
                </button>
              </strong>
            </div>

            <div className="detail-row">
              <span>Expiry Date</span>
              <strong>{card.expiry}</strong>
            </div>

          </div>

          <button
            className={
              card.status === 'Active'
                ? 'card-action block'
                : 'card-action unblock'
            }
            onClick={toggleCard}
          >
            {card.status === 'Active'
              ? <Lock size={18} />
              : <Unlock size={18} />}

            {card.status === 'Active'
              ? 'Block Card'
              : 'Unblock Card'}
          </button>
        </div>
      </div>

      {/* SECURITY INFO */}
      <div className="security-box">
        <Lock size={22} />

        <div>
          <h3>Card Security</h3>
          <p>
            You can block your card instantly if you notice
            suspicious activity. Unblocking restores normal
            card usage.
          </p>
        </div>
      </div>
    </div>
  );
}