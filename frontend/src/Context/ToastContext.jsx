import React, { createContext, useContext, useState, useCallback } from "react";
import ToastNotification from "../Home/ToastNotification";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Display the toast under navbar */}
      <div className="fixed right-6 z-50"> 
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
