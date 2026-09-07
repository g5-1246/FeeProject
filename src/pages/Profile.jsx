import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
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

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'FC';

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    saveProfile(formData);
    setEditing(false);
    setAlert({ type: 'success', message: 'Profile updated successfully.' });
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
    { name: 'fullName', label: 'Full Name', icon: User, type: 'text' },
    { name: 'email', label: 'Email', icon: Mail, type: 'text', disabled: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
    { name: 'dob', label: 'Date of Birth', icon: Calendar, type: 'date' },
    { name: 'address', label: 'Address', icon: MapPin, type: 'text' },
  ];

  return (
    <AuthenticatedLayout>
      <div className="page-fade profile">
        <h1 className="profile__heading">Profile</h1>
        <p className="profile__subtitle">View and manage your personal information.</p>

        {alert && (
          <div className="profile__alert">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <div className="profile__card">
          <Card
            action={
              editing ? (
                <div className="profile__actions">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
              )
            }
          >
            <div className="profile__avatar-row">
              <span className="profile__avatar">{initials}</span>
              <div>
                <p className="profile__name">{user?.fullName}</p>
                <p className="profile__account-type">{user?.accountType}</p>
              </div>
            </div>

            <div className="profile__grid">
              {fields.map(({ name, label, icon: Icon, type, disabled }) => (
                <div className="form-group" key={name}>
                  <label className="form-label" htmlFor={name}>
                    <Icon size={13} className="profile__field-icon" aria-hidden="true" /> {label}
                  </label>
                  {editing && !disabled ? (
                    <>
                      <input
                        id={name}
                        name={name}
                        type={type}
                        className={`form-input ${errors[name] ? 'form-input--error' : ''}`}
                        value={formData[name]}
                        onChange={handleChange}
                      />
                      {errors[name] && <p className="form-error-text">{errors[name]}</p>}
                    </>
                  ) : (
                    <p className="profile__static-value">
                      {name === 'dob' ? formatDate(formData[name]) : formData[name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
