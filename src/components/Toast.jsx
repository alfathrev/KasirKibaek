import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-fadeIn">
      <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl shadow-2xl bg-forest text-butter border-2 border-butter/30">
        <div className="flex items-center text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-butter mr-2.5 flex-shrink-0" />
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 hover:bg-forest-700 rounded-lg text-butter/80 hover:text-butter transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
