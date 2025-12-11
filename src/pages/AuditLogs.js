import React, { useEffect, useState } from "react";
import { adminAPI } from "../services/api";
import "../styles/Admin.css";

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.offset]);

  const fetchLogs = async () => {
    try {
      const response = await adminAPI.getAuditLogs(
        pagination.limit,
        pagination.offset
      );
      setLogs(response.data.logs);
      setPagination({ ...pagination, total: response.data.total });
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading audit logs...</div>;

  return (
    <div className="audit-container">
      <h1>Audit Logs</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity Type</th>
            <th>Entity ID</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.user_name || "System"}</td>
              <td>{log.action}</td>
              <td>{log.entity_type}</td>
              <td>{log.entity_id}</td>
              <td>{log.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() =>
            setPagination({
              ...pagination,
              offset: Math.max(0, pagination.offset - pagination.limit),
            })
          }
          disabled={pagination.offset === 0}
        >
          Previous
        </button>
        <span>Page {Math.floor(pagination.offset / pagination.limit) + 1}</span>
        <button
          onClick={() =>
            setPagination({
              ...pagination,
              offset: pagination.offset + pagination.limit,
            })
          }
          disabled={pagination.offset + pagination.limit >= pagination.total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;
