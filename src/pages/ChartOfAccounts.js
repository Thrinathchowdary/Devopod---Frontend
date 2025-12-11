import React, { useEffect, useState } from "react";
import { financeAPI } from "../services/api";
import "../styles/Finance.css";

export const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    account_code: "",
    account_name: "",
    account_type: "Asset",
    balance: 0,
    currency: "USD",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await financeAPI.getAccounts();
      setAccounts(response.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await financeAPI.createAccount(formData);
      fetchAccounts();
      setShowForm(false);
      setFormData({
        account_code: "",
        account_name: "",
        account_type: "Asset",
        balance: 0,
        currency: "USD",
      });
    } catch (err) {
      console.error("Error creating account:", err);
    }
  };

  if (loading) return <div className="loading">Loading accounts...</div>;

  return (
    <div className="finance-container">
      <div className="header">
        <h1>Chart of Accounts</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add Account"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateAccount} className="form-container">
          <div className="form-row">
            <input
              type="text"
              placeholder="Account Code"
              value={formData.account_code}
              onChange={(e) =>
                setFormData({ ...formData, account_code: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Account Name"
              value={formData.account_name}
              onChange={(e) =>
                setFormData({ ...formData, account_name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-row">
            <select
              value={formData.account_type}
              onChange={(e) =>
                setFormData({ ...formData, account_type: e.target.value })
              }
            >
              <option>Asset</option>
              <option>Liability</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
            <input
              type="number"
              placeholder="Initial Balance"
              value={formData.balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <button type="submit" className="btn-success">
            Save Account
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Account Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.account_code}</td>
              <td>{acc.account_name}</td>
              <td>{acc.account_type}</td>
              <td>${acc.balance.toFixed(2)}</td>
              <td>{acc.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChartOfAccounts;
