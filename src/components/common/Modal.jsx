import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md"
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl"
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className={`relative w-full ${currentSize} glass-panel rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col max-h-[85vh] z-10 transition-transform duration-300 scale-100 animate-fade-in`}
        style={{
          animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800/80">
          <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-slate-900/30 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
