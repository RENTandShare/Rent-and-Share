import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, type?: ToastType, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, type: ToastType = 'info', message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, type, title, message };
      setToasts((prev) => [...prev.slice(-4), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification HUD */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarn = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border transition-all transform translate-y-0 backdrop-blur-md ${
                isSuccess
                  ? 'bg-white/95 border-[#1FA463] text-[#1F1F1F]'
                  : isError
                  ? 'bg-white/95 border-rose-500 text-[#1F1F1F]'
                  : isWarn
                  ? 'bg-white/95 border-amber-500 text-[#1F1F1F]'
                  : 'bg-white/95 border-[#F26B21] text-[#1F1F1F]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#1FA463]" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {isWarn && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {!isSuccess && !isError && !isWarn && <Info className="w-5 h-5 text-[#F26B21]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight text-[#1F1F1F]">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
