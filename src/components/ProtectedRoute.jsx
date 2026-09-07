import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Wraps a page and redirects to /login if no demo session exists.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
