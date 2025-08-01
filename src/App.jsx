// src/App.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { createContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css';

// Sayfalar
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/LoginForm';
import NotFound from './pages/NotFound';
import NotAuthorized from './pages/NotAuthorized.jsx';
import Register from './pages/Register';
import SettingsDrawerWrapper from './pages/SettingsDrawerWrapper';
import WorkSpace from './pages/Workspace.jsx';

// Bileşenler
import ProtectedRoute from './components/ProtectedRoute';

export const ThemeContext = createContext();

const darkTheme = {
  background: "#18191A",
  color: "#E4E6EB",
};

const lightTheme = {
  background: "#f4f6fa",
  color: "#23272f",
};

function AppContent() {
  const { user, loading } = useAuth();
  
  // URL kontrolü yaparak admin sayfası için farklı tema davranışı sergile
  const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';
  const isAdminPage = window.location.pathname.startsWith('/admin');

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Yükleniyor...</div>;
  }

  // Admin veya login sayfaları için genel tema stilini uygulamıyoruz.
  // Bu sayfalardaki bileşenlerin kendi stilleri baskın gelecek.
  const appContainerStyle = isAdminPage || isLoginPage ? {} : { minHeight: "100vh" };
  const appContainerClass = isAdminPage || isLoginPage ? '' : (isLoginPage ? "theme-light" : "theme-dark");

  return (
    <div
      className={appContainerClass}
      style={{ ...appContainerStyle }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/404" element={<NotFound />} />

        {/* Protected Routes */}
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <WorkSpace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsDrawerWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*" // Admin sayfası ve alt rotaları için
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("dark");
  const themeStyles = useMemo(() => (theme === "dark" ? darkTheme : lightTheme), [theme]);

  // useEffect'i değiştiriyoruz.
  // Sadece admin ve login sayfaları dışındaki durumlar için body stilini güncelliyoruz.
  useEffect(() => {
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';
    const isAdminPage = window.location.pathname.startsWith('/admin');

    if (!isLoginPage && !isAdminPage) {
      document.body.style.background = themeStyles.background;
      document.body.style.color = themeStyles.color;
    } else {
       // Bu sayfalar için body stili sıfırlanıyor
       document.body.style.background = '';
       document.body.style.color = '';
    }
  }, [themeStyles]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <AppContent />
          </ThemeContext.Provider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
