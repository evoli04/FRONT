// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Uygulama açılışında localStorage'dan token'ı ve user bilgisini oku
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
      
      // Kullanıcı bilgisi varsa onu da yükle
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("User parsing error:", error);
        }
      }
    }
    
  }, []);

  const login = (userData, token) => {
    // BURAYA EKLEYİN: userData'nın içeriğini konsola yazdırın
    console.log("Login function received userData:", userData);

    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};