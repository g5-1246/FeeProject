import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = login(formData.email.trim(), formData.password);
      setLoading(false);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      navigate('/dashboard');
    }, 500);
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your accounts, transfers, and statements."
    >
      {formError && (
        <div className="login__alert">
          <Alert type="error" message={formError} onClose={() => setFormError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email or Username</label>
          <input
            id="email"
            name="email"
            type="text"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p className="form-error-text" id="email-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="form-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input form-input--with-icon ${errors.password ? 'form-input--error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
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
          {errors.password && <p className="form-error-text" id="password-error">{errors.password}</p>}
        </div>

        <div className="form-row-between">
          <label className="form-checkbox-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="login__forgot-link">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>Log In</Button>
      </form>

      <p className="login__demo-hint">
        Demo credentials — <strong>demo@fincentral.com</strong> / <strong>Demo@1234</strong>
      </p>

      <p className="form-footer-text">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
