// src/App.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { createContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth"; // ayrı dosyadaysa bu şekilde

import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css';

// Sayfalar
//import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/LoginForm';
import NotFound from './pages/NotFound';
import NotAuthorized from './pages/NotAuthorized.jsx';
import Register from './pages/Register';
import SettingsDrawerWrapper from './pages/SettingsDrawerWrapper';
import WorkSpace from './pages/Workspace.jsx';

export const ThemeContext = createContext();

const darkTheme = {
  background: "#18191A",
  color: "#E4E6EB",
};

const lightTheme = {
  background: "#f4f6fa",
  color: "#23272f",
};

// ProtectedRoute mantığını App içinde doğrudan kullanalım
function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Yükleniyor...</div>;
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          user ? <Dashboard /> : <Navigate to="/login" state={{ from: location }} replace />
        }
      />
      <Route
        path="/workspace"
        element={
          user ? <WorkSpace /> : <Navigate to="/login" state={{ from: location }} replace />
        }
      />
      <Route
        path="/settings"
        element={
          user ? <SettingsDrawerWrapper /> : <Navigate to="/login" state={{ from: location }} replace />
        }
      />
      <Route
        path="/admin"
        element={
          user
            ? isAdmin
              ? <Admin />
              : <Navigate to="/not-authorized" replace />
            : <Navigate to="/login" replace />
        }
      />
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [theme, setTheme] = useState("dark");
  const themeStyles = useMemo(() => (theme === "dark" ? darkTheme : lightTheme), [theme]);

  useEffect(() => {
    document.body.style.background = themeStyles.background;
    document.body.style.color = themeStyles.color;
  }, [themeStyles]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <div
              className={theme === "dark" ? "theme-dark" : "theme-light"}
              style={{ minHeight: "100vh", ...themeStyles }}
            >
              <AppContent />
            </div>
          </ThemeContext.Provider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

