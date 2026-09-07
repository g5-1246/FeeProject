import { X } from 'lucide-react';
import './Modal.css';

// Generic modal used for confirmations and success messages.
// actions: array of { label, onClick, variant } rendered as buttons via
// the caller (kept simple here — raw buttons to avoid a circular import
// with Button.jsx in edge cases, but you may pass <Button> elements too).
export default function Modal({ open, title, message, onClose, children, actions }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal__header">
          <h3 id="modal-title" className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          {message && <p className="modal__message">{message}</p>}
          {children}
        </div>
        {actions && <div className="modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
