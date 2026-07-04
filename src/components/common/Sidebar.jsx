import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  FolderOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = ({
  isOpen,
  setIsOpen,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { currentUser } = useAuth();

  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Pages", path: "/pages", icon: FileText },
    { name: "Banners", path: "/banners", icon: Image },
    { name: "Media Library", path: "/media", icon: FolderOpen },
    { name: "User Management", path: "/users", icon: Users, adminOnly: true }
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || currentUser?.role === "Admin"
  );

  const activeClass =
    "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 font-semibold";
  const inactiveClass =
    "text-gray-400 hover:text-white hover:bg-slate-800/40 border-l-2 border-transparent hover:border-slate-700/50";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0f1d] border-r border-slate-800/80">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 h-16">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950">
            <Shield className="h-5 w-5" />
          </div>
          {(isOpen || isMobileOpen) && (
            <span className="text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-wide">
              CMS Core
            </span>
          )}
        </div>
        
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4.5 py-3 px-3.5 rounded-xl smooth-transition ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {(isOpen || isMobileOpen) && (
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Active User Detail */}
      {(isOpen || isMobileOpen) && currentUser && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/20">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-9 w-9 rounded-full ring-2 ring-emerald-500/20 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-200 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
            </div>
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 uppercase">
              {currentUser.role}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (Slide-out menu) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out h-screen sticky top-0 flex-shrink-0 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {sidebarContent}
        
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 bg-slate-900 border border-slate-800 rounded-full p-1.5 text-gray-400 hover:text-white shadow-lg hover:border-emerald-500/30 transition-all z-20 cursor-pointer"
        >
          {isOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </>
  );
};
