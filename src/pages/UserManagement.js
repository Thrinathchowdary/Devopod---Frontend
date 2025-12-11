import React, { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import "../styles/Users.css";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      fetchUsers();
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await authAPI.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="users-container">
      <div className="header">
        <h1>User Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateUser} className="form-container">
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="Admin">Admin</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>
          <button type="submit" className="btn-success">
            Create User
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
