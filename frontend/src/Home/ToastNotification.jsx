import React, { useEffect, useState } from 'react';

const ToastNotification = ({ message, type = "success", duration = 5000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    let interval;
    let timeout = setTimeout(() => {
      onClose();
    }, duration);

    interval = setInterval(() => {
      setProgress(prev => prev - 100 / (duration / 100));
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  // Google-style colors and styling while maintaining the original structure
  const bgColor = type === "error" ? "bg-red-600" : "bg-gray-800";
  
  return (
    <div className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 shadow-lg rounded-full overflow-hidden ${bgColor}`}>
      <div className="px-6 py-3 text-white font-medium flex items-center">
        {/* Icon based on notification type */}
        {type === "error" ? (
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
        ) : (
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
        )}
        {message}
      </div>
      <div className="h-1 bg-white" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
    </div>
  );
};

export default ToastNotification;