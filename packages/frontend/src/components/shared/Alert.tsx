import React, { useEffect, useState } from 'react';

export type AlertProps = {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
  timeOut?: number;
  duration?: number;
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose, duration = 5000 }) => {
  const alertColors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const fadeIn = setTimeout(() => setOpacity(1), 10);
    const fadeOut = setTimeout(() => {
      setOpacity(0);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center`}
      style={{ zIndex: 1000 }}
    >
      <div
        className={`flex items-center justify-between p-4 rounded-md ${alertColors[type]} text-white max-w-md mx-auto transition-opacity duration-300`}
        style={{ opacity }}
      >
        <span>{message}</span>
        {onClose && (
          <button
            className="ml-4 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-25"
            onClick={onClose}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
