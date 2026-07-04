import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, LogOut, ChevronDown, User, ShieldAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "./Badge";

export const Navbar = ({ setIsMobileOpen }) => {
  const { currentUser, users, login } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dynamic Page Title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard Overview";
    if (path === "/pages") return "Manage Pages";
    if (path === "/banners") return "Manage Banners";
    if (path === "/media") return "Media Asset Library";
    if (path === "/users") return "User Access Management";
    if (path.startsWith("/content/new")) return "Create Content Item";
    if (path.startsWith("/content/edit")) return "Modify Content Item";
    return "CMS Workspace";
  };

  const handleUserSwap = (userId) => {
    login(userId);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#090d16]/70 backdrop-blur-md border-b border-slate-800/60 h-16">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800/40"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>
        
        <h2 className="text-base md:text-lg font-bold text-white tracking-wide leading-none">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Role Tester Alert */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl font-medium">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>RBAC Simulator: Use profile selector to test permissions</span>
        </div>

        {/* User Profiler Switcher */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-800/80 bg-slate-900/40 text-gray-200 hover:text-white hover:border-slate-700/60 transition-all text-xs font-semibold cursor-pointer select-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-500/30"
              />
              <span className="max-w-[80px] md:max-w-none truncate">{currentUser.name}</span>
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-64 glass-panel border border-slate-700/60 rounded-xl shadow-xl z-20 overflow-hidden py-1.5">
                  <div className="px-4 py-2 border-b border-slate-800/60">
                    <p className="text-xs text-gray-400">Simulation Settings</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Swap account to test role behaviors</p>
                  </div>
                  <div className="p-1 space-y-1">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSwap(user.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          currentUser.id === user.id
                            ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                            : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-[9px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant={user.role}>{user.role}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
