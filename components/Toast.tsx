import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-white border-primary text-text-main' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {type === 'success' ? <CheckCircle2 size={20} className="text-[#078816]" /> : <XCircle size={20} className="text-red-600" />}
        <p className="text-sm font-bold">{message}</p>
        <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;