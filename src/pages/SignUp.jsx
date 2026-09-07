import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { registerUser } from '../utils/auth.js';
import './SignUp.css';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  address: '',
  password: '',
  confirmPassword: '',
};

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak' };
  if (score <= 2) return { level: 2, label: 'Fair' };
  if (score === 3) return { level: 3, label: 'Good' };
  return { level: 4, label: 'Strong' };
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const strength = getPasswordStrength(formData.password);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    if (!formData.dob) newErrors.dob = 'Date of birth is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedToTerms) newErrors.terms = 'You must accept the Terms & Conditions.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const { confirmPassword, ...userData } = formData;
      const result = registerUser(userData);
      setLoading(false);

      if (!result.success) {
        setErrors((prev) => ({ ...prev, email: result.message }));
        return;
      }
      setSuccessOpen(true);
    }, 600);
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Open a FINCENTRAL BANK account in minutes."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="form-error-text">{errors.fullName}</p>}
        </div>

        <div className="signup__grid">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="form-error-text">{errors.phone}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            name="dob"
            type="date"
            className={`form-input ${errors.dob ? 'form-input--error' : ''}`}
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="form-error-text">{errors.dob}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            className={`form-input ${errors.address ? 'form-input--error' : ''}`}
            placeholder="Street, City, State"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="form-error-text">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="form-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input form-input--with-icon ${errors.password ? 'form-input--error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="form-input-icon-btn"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {formData.password && (
            <>
              <div className="password-strength">
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`password-strength__bar ${
                      bar <= strength.level
                        ? strength.level <= 1
                          ? 'password-strength__bar--filled-weak'
                          : strength.level <= 2
                          ? 'password-strength__bar--filled-fair'
                          : 'password-strength__bar--filled-strong'
                        : ''
                    }`}
                  />
                ))}
              </div>
              <p
                className="password-strength__label"
                style={{
                  color:
                    strength.level <= 1
                      ? 'var(--red-600)'
                      : strength.level <= 2
                      ? '#96631a'
                      : 'var(--green-600)',
                }}
              >
                {strength.label}
              </p>
            </>
          )}
          {errors.password && <p className="form-error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <div className="form-input-wrap">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              className={`form-input form-input--with-icon ${errors.confirmPassword ? 'form-input--error' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="form-input-icon-btn"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="form-error-text">{errors.confirmPassword}</p>}
        </div>

        <div className="form-group">
          <label className="form-checkbox-row">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                setErrors((prev) => ({ ...prev, terms: '' }));
              }}
            />
            I agree to the Terms &amp; Conditions and Privacy Policy
          </label>
          {errors.terms && <p className="form-error-text">{errors.terms}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading}>Create Account</Button>
      </form>

      <p className="form-footer-text">
        Already have an account? <Link to="/login">Log in</Link>
      </p>

      <Modal
        open={successOpen}
        title="Account created"
        message="Your FINCENTRAL BANK account has been created successfully. Please log in to continue."
        onClose={() => navigate('/login')}
        actions={
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        }
      />
    </AuthLayout>
  );
}
