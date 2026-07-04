import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-xl border transition-all duration-200 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold border-emerald-400/20 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_20px_-2px_rgba(16,185,129,0.5)] active:scale-98",
    secondary:
      "glass-panel text-gray-200 hover:text-white hover:bg-slate-800/80 border-slate-700/50 hover:border-slate-600 active:scale-98",
    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-medium border-rose-500/20 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.2)] active:scale-98",
    ghost:
      "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-slate-800/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
