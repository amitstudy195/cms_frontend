# CMS Admin Panel Frontend Client

This is the client-side single-page application (SPA) for the **CMS Admin Panel**, built using **React.js (via Vite)**, styled with **Tailwind CSS v4**, and routed using **React Router**. It features a glassmorphic dark theme, Role-Based Access Control (RBAC) simulations, debounced API search inputs, 30-second autosaving drafts, and custom SVG analytics dashboards.

---

## Key Features

*   **Responsive Sidebar & Navbar Shell**: Elegant glassmorphic panel layout. The sidebar collapses to a tight icon strip on desktop and expands to an off-canvas slide-out drawer on mobile devices.
*   **Role-Based Access Control (RBAC)**: Custom routing protection hooks (`ProtectedRoute.jsx`) and element-level wrappers (`RoleGuard.jsx`) block non-Admins from delete buttons, publishing toggles, and user management screens.
*   **Autosaving Editor Form**: Uses a custom hook (`useAutosave.js`) that monitors editor inputs and writes draft states to `localStorage` every 30 seconds if changes are made. It alerts and restores unsaved local drafts on page loads.
*   **Debounced Searches**: Integrates a custom hook (`useDebounce.js`) that delays search query triggers by 400ms during text entry to optimize network request traffic.
*   **Analytics Grid Dashboard**: Includes custom, high-performance SVG line trends, bandwidth metrics, and action split donut chart widgets.
*   **API Connection Switcher**: Supports a quick toggle option (`VITE_USE_MOCK`) to switch between local storage sandboxes and a live Node/Express backend.

---

## Directory Layout

```
frontend/
├── public/                 # Static branding logos and icons
├── src/
│   ├── assets/             # Global visual assets
│   ├── components/         # Reusable presenter and utility components
│   │   ├── auth/           # Route protections and RBAC guards
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleGuard.jsx
│   │   ├── common/         # Layout atoms (Button, Badge, Modal, Sidebar, Navbar)
│   │   ├── content/        # Content-specific form parts
│   │   └── dashboard/      # Custom SVG analytics charts grid
│   │       └── AnalyticsGrid.jsx
│   │   └── media/          # Media library items catalog and upload zones
│   │       ├── MediaGrid.jsx
│   │       └── MediaUpload.jsx
│   ├── context/            # Shared React states
│   │   ├── AuthContext.jsx # Profile selection and backend login tokens
│   │   └── NotificationContext.jsx # Elegant toast alert indicators
│   ├── hooks/              # Custom helper hooks
│   │   ├── useAuth.js      # Simplified RBAC checks
│   │   ├── useAutosave.js  # 30-second draft auto-saver
│   │   └── useDebounce.js  # Search API performance debouncer
│   ├── pages/              # Mapped routes views components
│   │   ├── Dashboard.jsx   # CMS statistics summaries
│   │   ├── ContentList.jsx # Table views with filters and pagination
│   │   ├── ContentEditor.jsx # Form workspaces with SEO fields
│   │   ├── MediaLibrary.jsx # Standalone media manager directory
│   │   ├── UserManagement.jsx # Admin roster controls
│   │   ├── Login.jsx       # Access portal
│   │   └── Unauthorized.jsx # 403 Restricted alert page
│   ├── services/           # Fetch service connection provider
│   │   └── api.js          # REST client wrapper (mock vs real backend)
│   ├── App.jsx             # Shell routing schema definition
│   ├── index.css           # Tailwind v4 configuration and styles
│   └── main.jsx            # Mount point resolving context layers
├── .env.example            # Blueprint template for environment settings
├── index.html              # Main HTML entry with SEO metadata
├── package.json            # Client dependency scripts
└── vite.config.js          # Vite compiler plugins configurations
```

---

## Installation & Configuration

### Prerequisites
Make sure **Node.js** (v18+) is installed on your workstation.

### Step 1: Install Dependencies
Open a terminal inside the `/frontend` directory and run:
```bash
npm install
```

### Step 2: Configure Environment Settings
Create a `.env` file in the `/frontend` folder matching the variables in `.env.example`:
```ini
# Backend Server API Endpoint connection
VITE_API_URL=http://localhost:5000/api

# Sandbox Mock configuration
# Set to "false" to connect to Express REST API server endpoints
# Set to "true" to use client-side LocalStorage simulation
VITE_USE_MOCK=false
```

---

## Run Instructions

### Start Development Server
Launch the Vite React application:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Create Production Build
Verify code compilation and create optimized distribution assets:
```bash
npm run build
```
Build outputs are written to the `/frontend/dist/` directory.

---

## User Roles Simulator for Testing

To test role behaviors, click on the user profile button in the top-right corner of the navbar to swap accounts:
1.  **Jane Doe (Admin)**: Full CRUD access. Can access "User Management", upload/delete media, edit templates, and publish content immediately.
2.  **Alex Rivera (Editor)**: Restricted access.
    *   Visiting `/users` displays the `403 Unauthorized` page.
    *   Delete buttons in tables and media libraries are disabled.
    *   Toggling "Publish" in the editor submits a request for approval (changing the status to `Pending Approval` in the database).
