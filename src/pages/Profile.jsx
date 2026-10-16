import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  ShieldCheck,
  Pencil,
  CheckCircle2,
} from 'lucide-react';

import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../utils/format.js';
import './Profile.css';

export default function Profile() {
  const { user, saveProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    address: user?.address || '',
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const initials = formData.fullName
    ? formData.fullName
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'FC';

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    saveProfile(formData);
    setEditing(false);
    setAlert({
      type: 'success',
      message: 'Profile updated successfully.',
    });
  }

  function handleCancel() {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
      address: user?.address || '',
    });

    setErrors({});
    setEditing(false);
  }

  const fields = [
    {
      name: 'fullName',
      label: 'Full Name',
      icon: User,
      type: 'text',
      placeholder: 'Enter your full name',
    },
    {
      name: 'email',
      label: 'Email Address',
      icon: Mail,
      type: 'email',
      disabled: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      icon: Phone,
      type: 'tel',
      placeholder: 'Enter your phone number',
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      icon: Calendar,
      type: 'date',
    },
    {
      name: 'address',
      label: 'Residential Address',
      icon: MapPin,
      type: 'text',
      placeholder: 'Enter your address',
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade profile">
        <div className="profile__topbar">
          <div>
            <p className="profile__eyebrow">YOUR ACCOUNT</p>
            <h1 className="profile__heading">My Profile</h1>
            <p className="profile__subtitle">
              Manage your personal information and account details.
            </p>
          </div>

          <div className="profile__secure-label">
            <ShieldCheck size={17} />
            <span>Account Information</span>
          </div>
        </div>

        {alert && (
          <div className="profile__alert">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="profile__hero">
          <div className="profile__hero-main">
            <div className="profile__avatar">{initials}</div>

            <div className="profile__hero-info">
              <p className="profile__hero-label">CUSTOMER PROFILE</p>
              <h2 className="profile__name">
                {formData.fullName || 'FINCENTRAL Customer'}
              </h2>
              <p className="profile__account-type">
                {user?.accountType || 'Bank Account'}
              </p>
            </div>
          </div>

          <div className="profile__hero-badge">
            <CheckCircle2 size={16} />
            <span>Profile</span>
          </div>
        </div>

        <div className="profile__summary-grid">
          <div className="profile__summary-card">
            <span className="profile__summary-icon">
              <User size={20} />
            </span>
            <div>
              <p>Customer ID</p>
              <h3>{user?.customerId || user?.id || 'Not available'}</h3>
            </div>
          </div>

          <div className="profile__summary-card">
            <span className="profile__summary-icon">
              <CreditCard size={20} />
            </span>
            <div>
              <p>Account Type</p>
              <h3>{user?.accountType || 'Not specified'}</h3>
            </div>
          </div>

          <div className="profile__summary-card">
            <span className="profile__summary-icon">
              <Mail size={20} />
            </span>
            <div>
              <p>Registered Email</p>
              <h3 className="profile__email-summary">
                {user?.email || 'Not available'}
              </h3>
            </div>
          </div>
        </div>

        <div className="profile__card">
          <Card
            action={
              editing ? (
                <div className="profile__actions">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={15} />
                  Edit Profile
                </Button>
              )
            }
          >
            <div className="profile__section-heading">
              <div>
                <h2>Personal Information</h2>
                <p>
                  {editing
                    ? 'Update the editable fields below.'
                    : 'Your registered personal details.'}
                </p>
              </div>
            </div>

            <div className="profile__grid">
              {fields.map(({ name, label, icon: Icon, type, disabled, placeholder }) => (
                <div className="form-group" key={name}>
                  <label className="form-label" htmlFor={name}>
                    <Icon
                      size={15}
                      className="profile__field-icon"
                      aria-hidden="true"
                    />
                    {label}
                  </label>

                  {editing && !disabled ? (
                    <>
                      <input
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder || ''}
                        className={`form-input ${
                          errors[name] ? 'form-input--error' : ''
                        }`}
                        value={formData[name]}
                        onChange={handleChange}
                      />

                      {errors[name] && (
                        <p className="form-error-text">{errors[name]}</p>
                      )}
                    </>
                  ) : (
                    <p className="profile__static-value">
                      {name === 'dob'
                        ? formData[name]
                          ? formatDate(formData[name])
                          : 'Not provided'
                        : formData[name] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!editing && (
              <div className="profile__footer-note">
                <ShieldCheck size={17} />
                <p>
                  Your email address is read-only here. Contact support if
                  your registered email needs to be changed.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}