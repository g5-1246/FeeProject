import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthenticatedLayout.css';

export default function AuthenticatedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleConfirmLogout() {
    logout();
    setLogoutModalOpen(false);
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />
      <div className="app-shell__main">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogoutClick={() => setLogoutModalOpen(true)}
        />
        <main className="app-shell__content">{children}</main>
      </div>

      <Modal
        open={logoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout of your FINCENTRAL BANK account?"
        onClose={() => setLogoutModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </>
        }
      />
    </div>
  );
}
