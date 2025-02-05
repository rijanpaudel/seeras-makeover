import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]= useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }
  return (
    <AuthContext.Provider value = {{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => {
  return useContext(AuthContext);
}
