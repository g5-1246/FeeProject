import { useRef } from 'react';
import './PinInput.css';

// Controlled segmented PIN entry. `value` is a string of digits (may be
// shorter than `length` while typing). Calls onChange with the new string.
// Calls onComplete once the value reaches `length` digits.
export default function PinInput({
  length = 4,
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
  label,
}) {
  const inputRefs = useRef([]);

  const digits = value.split('');

  function setDigitAt(index, digit) {
    const next = value.split('');
    next[index] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (joined.length === length && digit) {
      onComplete?.(joined);
    }
  }

  function handleChange(index, e) {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigitAt(index, '');
      return;
    }
    // Handles a single keystroke or a full paste landing in one box.
    if (raw.length > 1) {
      const joined = raw.slice(0, length);
      onChange(joined);
      const lastIndex = Math.min(joined.length, length) - 1;
      inputRefs.current[lastIndex]?.focus();
      if (joined.length === length) onComplete?.(joined);
      return;
    }
    setDigitAt(index, raw);
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigitAt(index - 1, '');
    }
  }

  return (
    <div className="pin-input">
      {label && <p className="pin-input__label">{label}</p>}
      <div className={`pin-input__boxes ${error ? 'pin-input__boxes--error' : ''}`}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoFocus={autoFocus && i === 0}
            disabled={disabled}
            value={digits[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`PIN digit ${i + 1} of ${length}`}
            className="pin-input__box"
          />
        ))}
      </div>
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
}
