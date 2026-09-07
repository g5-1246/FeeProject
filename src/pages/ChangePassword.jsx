import { useState } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword } from '../utils/auth.js';
import './ChangePassword.css';

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

const initialForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePassword() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [visibility, setVisibility] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const strength = getPasswordStrength(formData.newPassword);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required.';
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters.';
    }
    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = changePassword(user.email, formData.currentPassword, formData.newPassword);
      setLoading(false);
      if (!result.success) {
        setAlert({ type: 'error', message: result.message });
        return;
      }
      setAlert({ type: 'success', message: 'Password changed successfully.' });
      setFormData(initialForm);
    }, 600);
  }

  return (
    <AuthenticatedLayout>
      <div className="page-fade change-password">
        <h1 className="change-password__heading">Change Password</h1>
        <p className="change-password__subtitle">
          Choose a strong, unique password to keep your account secure.
        </p>

        <div className="change-password__card">
          <Card icon={KeyRound} title="Update your password">
            {alert && (
              <div className="change-password__alert">
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: 'currentPassword', label: 'Current Password', key: 'current' },
                { name: 'newPassword', label: 'New Password', key: 'next' },
                { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
              ].map(({ name, label, key }) => (
                <div className="form-group" key={name}>
                  <label className="form-label" htmlFor={name}>{label}</label>
                  <div className="form-input-wrap">
                    <input
                      id={name}
                      name={name}
                      type={visibility[key] ? 'text' : 'password'}
                      className={`form-input form-input--with-icon ${errors[name] ? 'form-input--error' : ''}`}
                      value={formData[name]}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="form-input-icon-btn"
                      onClick={() => setVisibility((v) => ({ ...v, [key]: !v[key] }))}
                      aria-label={visibility[key] ? 'Hide password' : 'Show password'}
                    >
                      {visibility[key] ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {name === 'newPassword' && formData.newPassword && (
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
                      <p className="password-strength__label">{strength.label}</p>
                    </>
                  )}
                  {errors[name] && <p className="form-error-text">{errors[name]}</p>}
                </div>
              ))}

              <Button type="submit" loading={loading}>Update Password</Button>
            </form>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
