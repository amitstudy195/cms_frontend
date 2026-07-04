import React from "react";

export const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-slate-800 text-slate-300 border-slate-700/50",
    
    // Statuses
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    scheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "pending approval": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    
    // Roles
    admin: "bg-rose-500/10 text-rose-400 border-rose-500/20 font-semibold",
    editor: "bg-sky-500/10 text-sky-400 border-sky-500/20 font-semibold",
  };

  const currentStyle = styles[variant.toLowerCase()] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} transition-all duration-150`}
    >
      {children || variant}
    </span>
  );
};
