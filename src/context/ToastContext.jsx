import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = "info", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = "Success") => {
    addToast({ title, message, type: "success" });
  }, [addToast]);

  const error = useCallback((message, title = "Error") => {
    addToast({ title, message, type: "error" });
  }, [addToast]);

  const info = useCallback((message, title = "Information") => {
    addToast({ title, message, type: "info" });
  }, [addToast]);

  const warning = useCallback((message, title = "Warning") => {
    addToast({ title, message, type: "warning" });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let border = "border-slate-800";
          let bg = "bg-slate-900/95";
          let icon = <Info className="w-5 h-5 text-indigo-400 shrink-0" />;

          if (toast.type === "success") {
            border = "border-emerald-500/40";
            bg = "bg-slate-900/95";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          } else if (toast.type === "error") {
            border = "border-rose-500/40";
            bg = "bg-slate-900/95";
            icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          } else if (toast.type === "warning") {
            border = "border-amber-500/40";
            bg = "bg-slate-900/95";
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border ${border} ${bg} text-slate-100 animate-slide-in transition-all`}
            >
              {icon}
              <div className="flex-1 text-sm">
                {toast.title && <p className="font-semibold text-slate-100">{toast.title}</p>}
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close"
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

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
