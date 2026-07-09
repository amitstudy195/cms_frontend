import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, KeyRound, UserPlus, LogIn, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const Login = () => {
  const { users, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();

  // Tab State: "login" | "register"
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Editor");

  // Redirect path after login
  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Login method handles both localStorage and MERN backend requests
      await login(email, password);
      showSuccess("Welcome back to CMS Workspace!");
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.message || "Failed to log in. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showError("Please fill in all registration fields.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      showSuccess(`Account created! Welcome, ${name}.`);
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Click handler to pre-fill credentials for demo accounts
  const handlePrefillUser = (demoUser) => {
    setEmail(demoUser.email);
    setPassword("password123");
    setActiveTab("login");
    showSuccess(`Pre-filled credentials for ${demoUser.name}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 space-y-8 bg-[#090d16]">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/10">
          <Shield className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wider">
            CMS ADMIN PORTAL
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Sign in to access your content management workspace
          </p>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="w-full max-w-md glass-panel border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/60 bg-slate-900/40">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "login"
                ? "bg-slate-900 text-emerald-400 border-b-2 border-emerald-500"
                : "text-gray-450 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "register"
                ? "bg-slate-900 text-emerald-400 border-b-2 border-emerald-500"
                : "text-gray-450 hover:text-white"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </button>
        </div>

        {/* Tab Panel Forms */}
        <div className="p-6">
          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10.5 pr-11 py-2.5 rounded-xl text-sm glass-input font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 rounded-xl mt-2 cursor-pointer font-bold"
              >
                Sign In to Dashboard
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10.5 pr-11 py-2.5 rounded-xl text-sm glass-input font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Select Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Access Permissions Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input font-semibold cursor-pointer"
                >
                  <option value="Editor">Editor (View / Edit Content only)</option>
                  <option value="Admin">Admin (Full access, Users control)</option>
                </select>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 rounded-xl mt-2 cursor-pointer font-bold"
              >
                Create Account & Log In
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Demo Users Preset Grid */}
      <div className="w-full max-w-md space-y-3">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">
          Quick Demo Accounts (Autofill)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {users.slice(0, 2).map((user) => (
            <button
              key={user.id}
              onClick={() => handlePrefillUser(user)}
              className="glass-panel glass-panel-hover p-3 rounded-xl border border-slate-800/80 text-left cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover border border-slate-700/80"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[9px] text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.role}>{user.role}</Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Security disclaimer */}
      <div className="flex items-center gap-2 text-[10px] text-gray-550 bg-slate-950/40 px-4 py-2 border border-slate-900 rounded-full max-w-sm text-center">
        <KeyRound className="h-3.5 w-3.5 text-emerald-500/40" />
        <span>Enterprise JWT security protocols and Zod schema validations active.</span>
      </div>
    </div>
  );
};
