import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AccountDetails from './pages/AccountDetails.jsx';
import AccountDetails from './pages/AccountDetails.jsx';

import Cards from './pages/Cards.jsx';
import Statement from './pages/Statement.jsx';
import BillPayments from './pages/BillPayments.jsx';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-details"
          element={
            <ProtectedRoute>
              <AccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
  path="/cards"
  element={
    <ProtectedRoute>
      <Cards />
    </ProtectedRoute>
  }
/>

<Route
  path="/statement"
  element={
    <ProtectedRoute>
      <Statement />
    </ProtectedRoute>
  }
/>

<Route
  path="/bill-payments"
  element={
    <ProtectedRoute>
      <BillPayments />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
