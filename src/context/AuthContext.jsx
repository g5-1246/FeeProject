import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  ensureDemoUser,
  getCurrentUser,
  isAuthenticated,
  loginUser,
  logoutUser,
  updateUser,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    ensureDemoUser();
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
    setAuthChecked(true);
  }, []);

  const login = useCallback((email, password) => {
    const result = loginUser(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  const saveProfile = useCallback((updates) => {
    if (!user) return null;
    const updated = updateUser(user.email, updates);
    setUser(updated);
    return updated;
  }, [user]);

  const value = {
    user,
    authChecked,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    saveProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
