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

  const bgStyles = {
    success: 'bg-emerald-800 text-white border-emerald-600',
    error: 'bg-rose-800 text-white border-rose-600',
    warning: 'bg-amber-800 text-white border-amber-600',
    info: 'bg-slate-900 text-white border-slate-700'
  }[type] || 'bg-slate-900 text-white border-slate-700';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 mr-2 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300 mr-2 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-300 mr-2 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-300 mr-2 flex-shrink-0" />
  }[type] || <Info className="w-5 h-5 text-sky-300 mr-2 flex-shrink-0" />;

  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-bounce-short">
      <div className={`flex items-center justify-between px-4 py-3 rounded-2xl shadow-xl border ${bgStyles}`}>
        <div className="flex items-center text-sm font-semibold">
          {icons}
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
