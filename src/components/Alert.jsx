import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Alert.css';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

// type: success | error | warning | info
// autoDismiss: milliseconds after which onClose fires automatically (optional)
export default function Alert({ type = 'info', message, onClose, autoDismiss }) {
  useEffect(() => {
    if (!autoDismiss || !onClose) return;
    const timer = setTimeout(onClose, autoDismiss);
    return () => clearTimeout(timer);
  }, [autoDismiss, onClose]);

  if (!message) return null;

  const Icon = ICONS[type] || Info;

  return (
    <div className={`alert alert--${type}`} role="status">
      <Icon size={18} className="alert__icon" aria-hidden="true" />
      <span className="alert__message">{message}</span>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Dismiss message">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
