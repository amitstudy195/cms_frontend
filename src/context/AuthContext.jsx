import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MOCK_USERS = [
  {
    id: "usr-1",
    name: "Jane Doe",
    email: "jane.doe@cms.com",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "usr-2",
    name: "Alex Rivera",
    email: "alex.rivera@cms.com",
    role: "Editor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60"
  }
];

const getAvatarUrl = (name, role) => {
  if (name === "Jane Doe") {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60";
  }
  if (name === "Alex Rivera") {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60";
  }
  const bg = role === "Admin" ? "10b981" : "3b82f6"; // Admin -> Emerald, Editor -> Blue
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=150&bold=true`;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("cms_current_user");
    return saved ? JSON.parse(saved) : null; // Start as logged out by default
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("cms_mock_users");
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });

  useEffect(() => {
    localStorage.setItem("cms_mock_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("cms_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("cms_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!USE_MOCK && currentUser && currentUser.role === "Admin") {
        try {
          const token = localStorage.getItem("cms_jwt_token");
          const response = await fetch(`${BASE_URL}/auth/users`, {
            headers: {
              "Authorization": token ? `Bearer ${token}` : ""
            }
          });
          const data = await response.json();
          if (data.success) {
            const mappedUsers = data.data.map(user => ({
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar || getAvatarUrl(user.name, user.role)
            }));
            setUsers(mappedUsers);
          }
        } catch (err) {
          console.error("Failed to load user roster from backend:", err);
        }
      } else if (!currentUser) {
        setUsers(MOCK_USERS);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Unified login (handles both Mock switcher and Backend JWT logins)
  const login = async (emailOrUserId, password = "") => {
    if (USE_MOCK) {
      // Local Mock Login
      const user = users.find((u) => u.id === emailOrUserId || u.email === emailOrUserId);
      if (user) {
        setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: "Mock user not found" };
    } else {
      // Real Backend API Login
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUserId, password })
      });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to authenticate");
      }

      const userPayload = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        avatar: getAvatarUrl(data.data.name, data.data.role)
      };

      // Store JWT token for API auth headers
      localStorage.setItem("cms_jwt_token", data.data.token);
      setCurrentUser(userPayload);
      
      return { success: true, user: userPayload };
    }
  };

  // Backend register helper
  const register = async (name, email, password, role = "Editor") => {
    if (USE_MOCK) {
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        avatar: getAvatarUrl(name, role)
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser); // Auto-login on registration
      return { success: true, user: newUser };
    } else {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      const userPayload = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        avatar: getAvatarUrl(data.data.name, data.data.role)
      };

      localStorage.setItem("cms_jwt_token", data.data.token);
      setCurrentUser(userPayload);
      
      return { success: true, user: userPayload };
    }
  };

  const logout = () => {
    localStorage.removeItem("cms_jwt_token");
    localStorage.removeItem("cms_current_user");
    setCurrentUser(null);
  };

  const changeUserRole = async (userId, newRole) => {
    if (USE_MOCK) {
      // Local Mock Role Change
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, role: newRole });
      }
    } else {
      try {
        const token = localStorage.getItem("cms_jwt_token");
        const response = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({ role: newRole })
        });
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || "Failed to update role");
        }

        const updatedUsers = users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        );
        setUsers(updatedUsers);
        if (currentUser && currentUser.id === userId) {
          setCurrentUser({ ...currentUser, role: newRole });
        }
      } catch (err) {
        console.error("Failed to update user role on backend:", err);
        throw err;
      }
    }
  };

  const isAdmin = currentUser?.role === "Admin";
  const isEditor = currentUser?.role === "Editor";

  const hasRole = (roles) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        changeUserRole,
        isAdmin,
        isEditor,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
