import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import Invoices from "./pages/Invoices";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="navbar-brand">ERP Finance</div>
        <div className="navbar-user">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="toggle-btn"
          >
            ☰
          </button>
          <ul className="nav-menu">
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/accounts">Chart of Accounts</a>
            </li>
            <li>
              <a href="/invoices">Invoices</a>
            </li>
            {user.role === "Admin" && (
              <>
                <li>
                  <a href="/users">User Management</a>
                </li>
                <li>
                  <a href="/audit-logs">Audit Logs</a>
                </li>
              </>
            )}
          </ul>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Layout>
                <ChartOfAccounts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Layout>
                <Invoices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <Layout>
                <AuditLogs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
