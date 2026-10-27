import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import SettingsPage from './pages/Settings.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AccountDetails from './pages/AccountDetails.jsx';
import Transactions from './pages/Transactions.jsx';

import Cards from './pages/Cards.jsx';
import Statement from './pages/Statement.jsx';
import BillPayments from './pages/BillPayments.jsx';
import Notifications from './pages/Notifications.jsx';
import Security from './pages/Security.jsx';
import Admin from './pages/Admin.jsx';
import PayTransfer from './pages/PayTransfer.jsx';
import TransferForm from './pages/TransferForm.jsx';
import Beneficiaries from './pages/Beneficiaries.jsx';
import TransferHistory from './pages/TransferHistory.jsx';
import Deposits from './pages/Deposits.jsx';
import DepositPlans from './pages/DepositPlans.jsx';
import DepositCalculator from './pages/DepositCalculator.jsx';
import MyDeposits from './pages/MyDeposits.jsx';
import CurrencyConverterPage from './pages/CurrencyConverterPage.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
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
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
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

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />
        

      <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pay-transfer"
          element={
            <ProtectedRoute>
              <PayTransfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay-transfer/send"
          element={
            <ProtectedRoute>
              <TransferForm mode="send" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay-transfer/quick-pay"
          element={
            <ProtectedRoute>
              <TransferForm mode="quick" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/beneficiaries"
          element={
            <ProtectedRoute>
              <Beneficiaries view="manage" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/beneficiaries/add"
          element={
            <ProtectedRoute>
              <Beneficiaries view="add" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer-history"
          element={
            <ProtectedRoute>
              <TransferHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposits"
          element={
            <ProtectedRoute>
              <Deposits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposits/fd"
          element={
            <ProtectedRoute>
              <DepositPlans type="fd" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposits/rd"
          element={
            <ProtectedRoute>
              <DepositPlans type="rd" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposits/my"
          element={
            <ProtectedRoute>
              <MyDeposits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposits/calculator"
          element={
            <ProtectedRoute>
              <DepositCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/currency-converter"
          element={
            <ProtectedRoute>
              <CurrencyConverterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <ComingSoon title="Payments" subtitle="Scheduled and recurring payments." description="Scheduling and recurring payments aren’t available yet. You can pay utility bills now from Bill Payments." linkTo="/bill-payments" linkLabel="Go to Bill Payments" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

