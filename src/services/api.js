import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => apiClient.post("/users/register", data),
  login: (data) => apiClient.post("/users/login", data),
  getUsers: () => apiClient.get("/users"),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export const financeAPI = {
  getAccounts: () => apiClient.get("/finance/accounts"),
  getAccountById: (id) => apiClient.get(`/finance/accounts/${id}`),
  createAccount: (data) => apiClient.post("/finance/accounts", data),
  updateAccount: (id, data) => apiClient.put(`/finance/accounts/${id}`, data),
  deleteAccount: (id) => apiClient.delete(`/finance/accounts/${id}`),
  getJournalEntries: () => apiClient.get("/finance/journal-entries"),
  getJournalEntryById: (id) => apiClient.get(`/finance/journal-entries/${id}`),
  createJournalEntry: (data) =>
    apiClient.post("/finance/journal-entries", data),
  approveJournalEntry: (id) =>
    apiClient.post(`/finance/journal-entries/${id}/approve`),
};

export const invoiceAPI = {
  getInvoices: () => apiClient.get("/invoices"),
  getInvoiceById: (id) => apiClient.get(`/invoices/${id}`),
  createInvoice: (data) => apiClient.post("/invoices", data),
  updateInvoiceStatus: (id, data) =>
    apiClient.put(`/invoices/${id}/status`, data),
  recordPayment: (id, data) => apiClient.post(`/invoices/${id}/payments`, data),
};

export const vendorCustomerAPI = {
  getVendors: () => apiClient.get("/vendors-customers/vendors"),
  createVendor: (data) => apiClient.post("/vendors-customers/vendors", data),
  getCustomers: () => apiClient.get("/vendors-customers/customers"),
  createCustomer: (data) =>
    apiClient.post("/vendors-customers/customers", data),
};

export const projectAPI = {
  getProjects: () => apiClient.get("/projects"),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post("/projects", data),
  updateProjectProgress: (data) => apiClient.post("/projects/progress", data),
};

export const insightsAPI = {
  getProjectRisk: (projectId) => apiClient.get(`/insights/risk/${projectId}`),
  getCashFlowForecast: () => apiClient.get("/insights/forecast/cashflow"),
  getProjectHealth: (projectId) =>
    apiClient.get(`/insights/health/${projectId}`),
};

export const dashboardAPI = {
  getKPIs: () => apiClient.get("/dashboard/kpis"),
  getAlerts: () => apiClient.get("/dashboard/alerts"),
  getCashFlowChart: () => apiClient.get("/dashboard/cashflow"),
};

export const adminAPI = {
  getAuditLogs: (limit = 100, offset = 0) =>
    apiClient.get("/admin/audit-logs", { params: { limit, offset } }),
  createAuditLog: (data) => apiClient.post("/admin/audit-logs", data),
};
