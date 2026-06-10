import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { userNav, adminNav } from './components/layout/nav';

// Public
import LandingPage from './pages/LandingPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User
import UserDashboard from './pages/user/UserDashboard';
import AccountsPage from './pages/user/AccountsPage';
import CardsPage from './pages/user/CardsPage';
import TransferPage from './pages/user/TransferPage';
import TransactionsPage from './pages/user/TransactionsPage';
import LoansPage from './pages/user/LoansPage';
import KycPage from './pages/user/KycPage';
import NotificationsPage from './pages/user/NotificationsPage';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminKyc from './pages/admin/AdminKyc';
import AdminLoans from './pages/admin/AdminLoans';
import AdminFraud from './pages/admin/AdminFraud';
import AdminAml from './pages/admin/AdminAml';
import AdminBlocked from './pages/admin/AdminBlocked';

function RequireAuth({ staff, children }: { staff?: boolean; children: JSX.Element }) {
  const { isAuthenticated, isStaff } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (staff && !isStaff) return <Navigate to="/app" replace />;
  if (!staff && isStaff) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  const { isAuthenticated, isStaff } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isStaff ? '/admin' : '/app'} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <RegisterPage />}
      />

      {/* User panel */}
      <Route
        path="/app/*"
        element={
          <RequireAuth>
            <AppLayout nav={userNav} variant="user">
              <Routes>
                <Route index element={<UserDashboard />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="transfer" element={<TransferPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="loans" element={<LoansPage />} />
                <Route path="kyc" element={<KycPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Admin / Manager panel */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth staff>
            <AppLayout nav={adminNav} variant="admin">
              <Routes>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="kyc" element={<AdminKyc />} />
                <Route path="loans" element={<AdminLoans />} />
                <Route path="fraud" element={<AdminFraud />} />
                <Route path="aml" element={<AdminAml />} />
                <Route path="blocked" element={<AdminBlocked />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={isAuthenticated ? (isStaff ? '/admin' : '/app') : '/'} replace />} />
    </Routes>
  );
}
