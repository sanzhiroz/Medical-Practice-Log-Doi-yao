import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      stripe: 'bg-emerald-600',
    },
    error: {
      bg: 'bg-red-50 border-red-300 text-red-950',
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
      stripe: 'bg-red-600',
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-950',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
      stripe: 'bg-sky-600',
    },
  }[toast.type];

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-slideUp">
      <div className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 relative overflow-hidden ${styles.bg}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.stripe}`}></div>
        {styles.icon}
        <div className="flex-1 text-xs space-y-0.5">
          <div className="font-bold text-sm tracking-tight">{toast.title}</div>
          <p className="text-slate-600 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
