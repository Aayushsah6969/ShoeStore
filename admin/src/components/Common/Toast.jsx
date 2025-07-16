import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const Toast = () => {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center p-4 rounded-lg shadow-lg border max-w-md
        ${getBgColor()}
      `}>
        {getIcon()}
        <span className="ml-3 text-sm font-medium text-gray-800">
          {toast.message}
        </span>
        <button
          onClick={hideToast}
          className="ml-auto pl-3"
        >
          <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Toast;