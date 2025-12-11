import React, { useEffect, useState } from "react";
import { invoiceAPI, vendorCustomerAPI } from "../services/api";
import "../styles/Invoice.css";

export const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    invoice_type: "Sales",
    customer_id: null,
    vendor_id: null,
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: "",
    items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
    tax_amount: 0,
    currency: "USD",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, custRes, vendRes] = await Promise.all([
        invoiceAPI.getInvoices(),
        vendorCustomerAPI.getCustomers(),
        vendorCustomerAPI.getVendors(),
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
      setVendors(vendRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await invoiceAPI.createInvoice(formData);
      fetchData();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating invoice:", err);
    }
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...formData.items];
    newItems[idx][field] =
      field === "amount"
        ? parseFloat(value)
        : isNaN(value)
        ? value
        : parseFloat(value);
    if (field === "quantity" || field === "unit_price") {
      newItems[idx].amount = newItems[idx].quantity * newItems[idx].unit_price;
    }
    setFormData({ ...formData, items: newItems });
  };

  if (loading) return <div className="loading">Loading invoices...</div>;

  return (
    <div className="invoice-container">
      <div className="header">
        <h1>Invoices</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Create Invoice"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateInvoice} className="invoice-form">
          <div className="form-row">
            <select
              value={formData.invoice_type}
              onChange={(e) =>
                setFormData({ ...formData, invoice_type: e.target.value })
              }
            >
              <option value="Sales">Sales Invoice</option>
              <option value="Purchase">Purchase Invoice</option>
            </select>
            {formData.invoice_type === "Sales" && (
              <select
                value={formData.customer_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, customer_id: e.target.value })
                }
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {formData.invoice_type === "Purchase" && (
              <select
                value={formData.vendor_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_id: e.target.value })
                }
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-row">
            <input
              type="date"
              value={formData.invoice_date}
              onChange={(e) =>
                setFormData({ ...formData, invoice_date: e.target.value })
              }
            />
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
          </div>

          <h3>Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(idx, "unit_price", e.target.value)
                      }
                    />
                  </td>
                  <td>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="form-row">
            <input
              type="number"
              placeholder="Tax Amount"
              value={formData.tax_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tax_amount: parseFloat(e.target.value),
                })
              }
            />
            <button type="submit" className="btn-success">
              Create Invoice
            </button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Type</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoice_number}</td>
              <td>{inv.invoice_type}</td>
              <td>{new Date(inv.invoice_date).toLocaleDateString()}</td>
              <td>${inv.total_amount.toFixed(2)}</td>
              <td>
                <span className={`status ${inv.status.toLowerCase()}`}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
