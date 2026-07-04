import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./components/common/Sidebar";
import { Navbar } from "./components/common/Navbar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages imports
import { Dashboard } from "./pages/Dashboard";
import { ContentList } from "./pages/ContentList";
import { ContentEditor } from "./pages/ContentEditor";
import { MediaLibrary } from "./pages/MediaLibrary";
import { UserManagement } from "./pages/UserManagement";
import { Unauthorized } from "./pages/Unauthorized";
import { Login } from "./pages/Login";

// Layout Shell for Admin Dashboard
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16] text-gray-100">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        setIsMobileOpen={setMobileSidebarOpen}
      />

      {/* Main viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar setIsMobileOpen={setMobileSidebarOpen} />

        {/* Dynamic page content scroll wrapper */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected CMS Dashboard Workspace Shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<Dashboard />} />

        {/* Content Listing Module */}
        <Route path="pages" element={<ContentList />} />
        <Route path="banners" element={<ContentList />} />

        {/* Content Creator & Editor Modules */}
        <Route path="content/new/:type" element={<ContentEditor />} />
        <Route path="content/edit/:id" element={<ContentEditor />} />

        {/* Media Library Module */}
        <Route path="media" element={<MediaLibrary />} />

        {/* User Management Module (Admins only!) */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
