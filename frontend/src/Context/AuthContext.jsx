import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage when the app loads
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // On initial load, retrieve user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
