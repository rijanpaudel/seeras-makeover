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

  return (
    <div className={`fixed top-32 right-6 z-50 w-80 shadow-lg rounded-lg overflow-hidden ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      <div className="px-4 py-3 text-white font-semibold">
        {message}
      </div>
      <div className="h-1 bg-white" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
    </div>
  );
};

export default ToastNotification;
