import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-white' />;
      case 'error':
        return <XCircle className='w-5 h-5 text-white' />;
      case 'warning':
        return <AlertCircle className='w-5 h-5 text-white' />;
      case 'info':
        return <AlertCircle className='w-5 h-5 text-white' />;
      default:
        return <CheckCircle className='w-5 h-5 text-white' />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#079455] border-[#079455]';
      case 'error':
        return 'bg-red-600 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-500';
      case 'info':
        return 'bg-blue-600 border-blue-600';
      default:
        return 'bg-[#079455] border-[#079455]';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-white';
      case 'error':
        return 'text-white';
      case 'warning':
        return 'text-white';
      case 'info':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      className={`fixed z-50 transform transition-all duration-300 ease-in-out ${getBackgroundColor()} ${
        // Mobile: centered, 68px from top, 345px width, 40px height
        'left-1/2 -translate-x-1/2 top-[68px] w-[345px] h-10 px-3 py-2 rounded-lg md:top-4 md:right-4 md:left-auto md:translate-x-0 md:max-w-sm md:w-full md:h-auto md:px-4 md:py-4'
      }`}
    >
      <div className='flex items-center justify-center gap-2 h-full md:items-start md:justify-start md:gap-0'>
        <div className='flex-shrink-0'>{getIcon()}</div>
        <div className='flex-1 md:ml-3'>
          <h4
            className={`text-sm font-medium ${getTextColor()} text-center md:text-left`}
          >
            {title}
          </h4>
          {message && (
            <p
              className={`mt-1 text-sm ${getTextColor()} opacity-90 text-center md:text-left hidden md:block`}
            >
              {message}
            </p>
          )}
        </div>
        <div className='flex-shrink-0 md:ml-4'>
          <button
            onClick={() => onClose(id)}
            className={`inline-flex rounded-md p-1.5 text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500`}
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className='fixed z-50 space-y-2 md:top-4 md:right-4'>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
