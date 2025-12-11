import React, { useEffect, useState } from "react";
import { dashboardAPI, insightsAPI } from "../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";

export const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, alertRes, cashRes] = await Promise.all([
          dashboardAPI.getKPIs(),
          dashboardAPI.getAlerts(),
          dashboardAPI.getCashFlowChart(),
        ]);
        setKpis(kpiRes.data);
        setAlerts(alertRes.data);
        setCashFlow(cashRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Projects</h3>
          <p className="kpi-value">{kpis?.total_projects || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Total Invoices</h3>
          <p className="kpi-value">{kpis?.total_invoices || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Pending Payments</h3>
          <p className="kpi-value">
            ${kpis?.pending_payments?.toFixed(2) || 0}
          </p>
        </div>
        <div className="kpi-card">
          <h3>Cash Balance</h3>
          <p className="kpi-value">${kpis?.cash_balance?.toFixed(2) || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Total Expenses</h3>
          <p className="kpi-value">${kpis?.total_expenses?.toFixed(2) || 0}</p>
        </div>
        <div className="kpi-card alert">
          <h3>High Risk Projects</h3>
          <p className="kpi-value">{kpis?.high_risk_projects || 0}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>Alerts</h2>
          <div className="alerts-list">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`alert alert-${alert.severity}`}>
                <strong>{alert.type.replace("_", " ").toUpperCase()}</strong>
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cash Flow Chart */}
      <div className="chart-container">
        <h2>Cash Flow (Last 30 Days)</h2>
        {cashFlow.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inflow" fill="#8884d8" />
              <Bar dataKey="outflow" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No cash flow data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
