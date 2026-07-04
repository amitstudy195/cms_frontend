import React, { useState } from "react";
import { Users, Shield, ShieldCheck, Mail, ArrowRight, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const UserManagement = () => {
  const { users, currentUser, changeUserRole } = useAuth();
  const { showSuccess } = useNotification();
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Editor");

  const handleRoleChange = (userId, newRole) => {
    changeUserRole(userId, newRole);
    showSuccess("User permissions updated successfully.");
  };

  const handleAddUserSimulator = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    showSuccess(`"${newUserName}" added to team roster (Simulation only).`);
    setNewUserName("");
    setNewUserEmail("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Info */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
          User Access Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review, assign, and alter role access levels for workspace staff. Only Admins can view this control panel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Team Roster Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800/60 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">Active Team Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Access</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs text-gray-300">
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="hover:bg-slate-900/10">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-850"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {user.name} {isSelf && <span className="text-[10px] text-emerald-400 font-bold">(You)</span>}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </td>

                      {/* Current Role badge */}
                      <td className="py-4 px-4">
                        <Badge variant={user.role} />
                      </td>

                      {/* Swap Controls */}
                      <td className="py-4 px-4 text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isSelf} // prevent accidental self-demotion
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold glass-input cursor-pointer ${
                            isSelf ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Simulator Box */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800/60 pb-3 flex items-center gap-2 text-white">
              <UserPlus className="h-4.5 w-4.5 text-emerald-400" />
              <h3 className="text-sm font-semibold tracking-wide">Invite Team Member</h3>
            </div>

            <form onSubmit={handleAddUserSimulator} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="simName" className="text-xs font-semibold text-gray-300">
                  Full Name
                </label>
                <input
                  id="simName"
                  type="text"
                  placeholder="E.g. Sarah Jenkins"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="simEmail" className="text-xs font-semibold text-gray-300">
                  Email Address
                </label>
                <input
                  id="simEmail"
                  type="email"
                  placeholder="sarah.j@cms.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input font-medium"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label htmlFor="simRole" className="text-xs font-semibold text-gray-300">
                  Assign Default Role
                </label>
                <select
                  id="simRole"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input font-semibold cursor-pointer"
                >
                  <option value="Editor">Editor (Write Only)</option>
                  <option value="Admin">Admin (Full Control)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-bold mt-2">
                Simulate Invitation
              </Button>
            </form>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-start gap-2.5 text-[10px] text-gray-500">
            <Shield className="h-4 w-4 text-emerald-500/50 flex-shrink-0" />
            <p className="leading-tight">
              Invitations trigger confirmation emails requesting key token validation. Roles are bound upon onboarding completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
