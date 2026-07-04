import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, KeyRound, UserCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { Badge } from "../components/common/Badge";

export const Login = () => {
  const { users, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotification();

  // Redirect path after successful login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (userId, name) => {
    login(userId);
    showSuccess(`Logged in as ${name}!`);
    navigate(from, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 space-y-8 bg-[#090d16]">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/10">
          <Shield className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wider">
            CMS ADMIN PORTAL
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Select a simulation profile to access the content management workspace
          </p>
        </div>
      </div>

      {/* User profile selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleLogin(user.id, user.name)}
            className="w-full text-left glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt=""
                className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-800/80 group-hover:ring-emerald-500/30 transition-all"
              />
              <div className="min-w-0">
                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 w-full">
              <Badge variant={user.role}>{user.role}</Badge>
              <span className="text-[10px] text-emerald-400 group-hover:underline font-semibold flex items-center gap-1">
                Access Panel <UserCheck className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Simulation alert */}
      <div className="flex items-center gap-2 text-[10px] text-gray-600 bg-slate-950/40 px-4 py-2 border border-slate-900 rounded-full max-w-sm text-center">
        <KeyRound className="h-3.5 w-3.5 text-emerald-500/40" />
        <span>Pre-configured development sandbox. No passwords required.</span>
      </div>
    </div>
  );
};
