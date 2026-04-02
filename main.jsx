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

function AppRoutes() {
  const { token } = useSelector((s) => s.auth);
  return (
    <Routes>
      <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={token ? <ChatPage /> : <Navigate to="/auth" replace />} />
      <Route path="/admin" element={token ? <AdminPage /> : <Navigate to="/auth" replace />} />
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
