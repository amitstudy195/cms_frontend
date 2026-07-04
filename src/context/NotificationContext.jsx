import React, { createContext, useState, useContext, useCallback } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const showError = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const showWarning = useCallback((msg, dur) => addToast(msg, "warning", dur), [addToast]);
  const showInfo = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);

  return (
    <NotificationContext.Provider
      value={{ showSuccess, showError, showWarning, showInfo, removeToast }}
    >
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => {
          const { id, message, type } = toast;
          
          let icon = <Info className="h-5 w-5 text-sky-400" />;
          let borderColor = "border-sky-500/30";
          let bgColor = "bg-slate-900/90";
          let textColor = "text-sky-200";
          let shadowColor = "shadow-sky-500/5";

          if (type === "success") {
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
            borderColor = "border-emerald-500/30";
            bgColor = "bg-slate-900/90";
            textColor = "text-emerald-200";
            shadowColor = "shadow-emerald-500/5";
          } else if (type === "error") {
            icon = <XCircle className="h-5 w-5 text-rose-400" />;
            borderColor = "border-rose-500/30";
            bgColor = "bg-slate-900/90";
            textColor = "text-rose-200";
            shadowColor = "shadow-rose-500/5";
          } else if (type === "warning") {
            icon = <AlertCircle className="h-5 w-5 text-amber-400" />;
            borderColor = "border-amber-500/30";
            bgColor = "bg-slate-900/90";
            textColor = "text-amber-200";
            shadowColor = "shadow-amber-500/5";
          }

          return (
            <div
              key={id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} shadow-lg ${shadowColor} backdrop-blur-md transition-all duration-300 animate-slide-in`}
              style={{
                animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-sm font-medium text-gray-200">{message}</p>
              </div>
              <button
                onClick={() => removeToast(id)}
                className="ml-4 text-gray-400 hover:text-white transition-colors duration-150"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
