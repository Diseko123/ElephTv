import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function normalizeList(payload, key) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.[key])) {
    return payload[key];
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function getOrderId(order) {
  return order?.orderId || order?.id || order?._id || "";
}

function isPendingOrder(order) {
  const values = [
    order?.status,
    order?.paymentStatus,
    order?.deliveryStatus,
    order?.activationStatus,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return values.some((value) => value.includes("pending")) || values.length === 0;
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function AdminPage({ apiUrl }) {
  const [orders, setOrders] = useState([]);
  const [codes, setCodes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [deliveringId, setDeliveringId] = useState("");

  const analyticsEntries = useMemo(() => Object.entries(analytics || {}), [analytics]);

  async function fetchJson(path) {
    const response = await fetch(`${apiUrl}${path}`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || `Unable to load ${path}`);
    }

    return payload;
  }

  async function loadDashboard() {
    setLoading(true);
    setErrors({});

    const [ordersResult, codesResult, analyticsResult] = await Promise.allSettled([
      fetchJson("/orders"),
      fetchJson("/codes"),
      fetchJson("/analytics"),
    ]);

    if (ordersResult.status === "fulfilled") {
      setOrders(normalizeList(ordersResult.value, "orders"));
    } else {
      setOrders([]);
      setErrors((current) => ({ ...current, orders: ordersResult.reason.message }));
    }

    if (codesResult.status === "fulfilled") {
      setCodes(normalizeList(codesResult.value, "codes"));
    } else {
      setCodes([]);
      setErrors((current) => ({ ...current, codes: codesResult.reason.message }));
    }

    if (analyticsResult.status === "fulfilled") {
      setAnalytics(analyticsResult.value.analytics || analyticsResult.value.overview || analyticsResult.value);
    } else {
      setAnalytics({});
      setErrors((current) => ({ ...current, analytics: analyticsResult.reason.message }));
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function deliverOrder(orderId) {
    if (!orderId) {
      return;
    }

    setDeliveringId(orderId);
    setErrors((current) => ({ ...current, deliver: "" }));

    try {
      const response = await fetch(`${apiUrl}/orders/${orderId}/deliver`, {
        method: "PATCH",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Unable to deliver order");
      }

      await loadDashboard();
    } catch (error) {
      setErrors((current) => ({ ...current, deliver: error.message }));
    } finally {
      setDeliveringId("");
    }
  }

  return (
    <main className="admin-page">
      <AdminPageStyles />
      <header className="admin-hero">
        <div>
          <span className="admin-eyebrow">Eleph TV Admin</span>
          <h1>Operations Dashboard</h1>
          <p>Track orders, code inventory, and store analytics from one focused admin view.</p>
        </div>
        <Link className="admin-back" to="/">
          Back to website
        </Link>
      </header>

      {loading && <div className="admin-status">Loading admin dashboard...</div>}
      {errors.deliver && <div className="admin-error">{errors.deliver}</div>}

      <section className="admin-grid" aria-label="Analytics">
        <AdminSection title="Analytics" error={errors.analytics}>
          {analyticsEntries.length > 0 ? (
            <div className="metric-grid">
              {analyticsEntries.map(([label, value]) => (
                <div className="metric-card" key={label}>
                  <span>{label}</span>
                  <strong>{formatValue(value)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No analytics returned yet." />
          )}
        </AdminSection>
      </section>

      <section className="admin-two-column">
        <AdminSection title="Orders" error={errors.orders}>
          {orders.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const orderId = getOrderId(order);
                    const pending = isPendingOrder(order);

                    return (
                      <tr key={orderId || index}>
                        <td>{formatValue(orderId)}</td>
                        <td>{formatValue(order.customerName || order.name)}</td>
                        <td>{formatValue(order.email || order.customerEmail)}</td>
                        <td>{formatValue(order.plan || order.planName)}</td>
                        <td>{formatValue(order.status || order.deliveryStatus || order.paymentStatus)}</td>
                        <td>
                          {pending ? (
                            <button
                              className="deliver-button"
                              disabled={!orderId || deliveringId === orderId}
                              type="button"
                              onClick={() => deliverOrder(orderId)}
                            >
                              {deliveringId === orderId ? "Delivering..." : "Deliver"}
                            </button>
                          ) : (
                            <span className="delivered-label">Delivered</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No orders returned yet." />
          )}
        </AdminSection>

        <AdminSection title="Codes" error={errors.codes}>
          {codes.length > 0 ? (
            <div className="code-list">
              {codes.map((code, index) => (
                <article className="code-card" key={code.id || code._id || code.code || index}>
                  <strong>{formatValue(code.code || code.activationCode || code.value)}</strong>
                  <span>{formatValue(code.plan || code.planName || code.package)}</span>
                  <small>{formatValue(code.status || (code.used ? "Used" : "Available"))}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="No codes returned yet." />
          )}
        </AdminSection>
      </section>
    </main>
  );
}

function AdminSection({ children, error, title }) {
  return (
    <section className="admin-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        {error && <span className="panel-error">{error}</span>}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }) {
  return <p className="empty-state">{message}</p>;
}

function AdminPageStyles() {
  return (
    <style>{`
      .admin-page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(91, 141, 239, 0.3), transparent 34rem),
          radial-gradient(circle at top right, rgba(143, 80, 255, 0.26), transparent 32rem),
          #070914;
        color: #f7f8ff;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 32px;
      }

      .admin-hero,
      .admin-panel {
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(13, 18, 38, 0.78);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(20px);
      }

      .admin-hero {
        align-items: center;
        border-radius: 28px;
        display: flex;
        gap: 24px;
        justify-content: space-between;
        margin: 0 auto 24px;
        max-width: 1200px;
        padding: 32px;
      }

      .admin-eyebrow,
      .panel-error,
      .empty-state {
        color: #9fb7ff;
      }

      .admin-hero h1,
      .panel-heading h2 {
        margin: 0;
      }

      .admin-hero h1 {
        font-size: clamp(2rem, 5vw, 4rem);
        line-height: 1;
        margin-top: 10px;
      }

      .admin-hero p {
        color: #c4c9dd;
        margin: 14px 0 0;
        max-width: 680px;
      }

      .admin-back,
      .deliver-button {
        border: 0;
        border-radius: 999px;
        color: #fff;
        cursor: pointer;
        font-weight: 800;
        text-decoration: none;
      }

      .admin-back {
        background: linear-gradient(135deg, #6d7cff, #14c8ff);
        box-shadow: 0 16px 40px rgba(64, 137, 255, 0.28);
        flex: 0 0 auto;
        padding: 14px 20px;
      }

      .admin-grid,
      .admin-two-column {
        margin: 0 auto;
        max-width: 1200px;
      }

      .admin-two-column {
        display: grid;
        gap: 24px;
        grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
      }

      .admin-panel {
        border-radius: 24px;
        margin-bottom: 24px;
        overflow: hidden;
        padding: 24px;
      }

      .panel-heading {
        align-items: flex-start;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .panel-error {
        font-size: 0.88rem;
        text-align: right;
      }

      .metric-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .metric-card,
      .code-card {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.06);
        padding: 16px;
      }

      .metric-card span,
      .code-card span,
      .code-card small {
        color: #aeb5ce;
        display: block;
      }

      .metric-card strong {
        display: block;
        font-size: 1.45rem;
        margin-top: 8px;
      }

      .table-wrap {
        overflow-x: auto;
      }

      table {
        border-collapse: collapse;
        min-width: 760px;
        width: 100%;
      }

      th,
      td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 14px 12px;
        text-align: left;
      }

      th {
        color: #96a5d8;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      td {
        color: #eef1ff;
      }

      .deliver-button {
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        padding: 10px 14px;
      }

      .deliver-button:disabled {
        cursor: wait;
        opacity: 0.65;
      }

      .delivered-label {
        color: #76f7b8;
        font-weight: 800;
      }

      .code-list {
        display: grid;
        gap: 12px;
      }

      .code-card strong {
        display: block;
        margin-bottom: 8px;
      }

      .admin-status,
      .admin-error {
        border-radius: 16px;
        margin: 0 auto 20px;
        max-width: 1200px;
        padding: 14px 18px;
      }

      .admin-status {
        background: rgba(255, 255, 255, 0.08);
        color: #cbd4ff;
      }

      .admin-error {
        background: rgba(255, 74, 104, 0.15);
        color: #ffb5c1;
      }

      @media (max-width: 800px) {
        .admin-page {
          padding: 18px;
        }

        .admin-hero {
          align-items: stretch;
          flex-direction: column;
          padding: 24px;
        }

        .admin-back {
          text-align: center;
        }

        .admin-two-column {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

export default AdminPage;
