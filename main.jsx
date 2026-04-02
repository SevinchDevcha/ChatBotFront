import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './app/store';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './features/auth/AuthPage';
import { useSelector } from 'react-redux';
import './index.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { token } = useSelector((s) => s.auth);
  return (
    <Routes>
      <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
