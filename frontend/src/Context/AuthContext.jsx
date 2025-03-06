import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial load, retrieve user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    // Save user data and token to localStorage and update state
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // Update state immediately after login
  };

  const logout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem("user"); //Remove user data
    setUser(null); // Clear user state immediately on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
