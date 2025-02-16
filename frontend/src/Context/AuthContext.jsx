import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  // On initial load, retrieve user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    // Save user data and token to localStorage and update state
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUserState(userData); // Update state immediately after login
  };

  const logout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(null); // Clear user state immediately on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
