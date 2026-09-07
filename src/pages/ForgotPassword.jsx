import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email linked to your account and we'll send you a reset link."
    >
      {submitted ? (
        <Alert
          type="success"
          message="If an account exists with this email, a password reset link has been sent."
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className={`form-input ${error ? 'form-input--error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            {error && <p className="form-error-text">{error}</p>}
          </div>

          <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
        </form>
      )}

      <Link to="/login" className="form-back-link">
        <ArrowLeft size={15} /> Back to Login
      </Link>
    </AuthLayout>
  );
}
