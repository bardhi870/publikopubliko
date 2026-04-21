import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialPayments = [
  {
    id: 1,
    clientName: "Ardit Krasniqi",
    amount: "100",
    paymentDate: "2026-04-18",
    paymentMethod: "Cash",
    note: "Pagesa e parë / avans"
  },
  {
    id: 2,
    clientName: "Blerina Gashi",
    amount: "200",
    paymentDate: "2026-04-17",
    paymentMethod: "Bankë",
    note: "Pagesa e plotë"
  }
];

const initialForm = {
  clientName: "",
  amount: "",
  paymentDate: "",
  paymentMethod: "Cash",
  note: ""
};

export default function AdminPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];
    const todayPayments = payments.filter(
      (item) => item.paymentDate === today
    ).length;

    return {
      totalPayments,
      totalAmount,
      todayPayments
    };
  }, [payments]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.amount.trim()) return;

    if (editingId) {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === editingId ? { ...payment, ...formData } : payment
        )
      );
    } else {
      setPayments((prev) => [
        {
          id: Date.now(),
          ...formData
        },
        ...prev
      ]);
    }

    resetForm();
  };

  const handleEdit = (payment) => {
    setEditingId(payment.id);
    setFormData({
      clientName: payment.clientName || "",
      amount: payment.amount || "",
      paymentDate: payment.paymentDate || "",
      paymentMethod: payment.paymentMethod || "Cash",
      note: payment.note || ""
    });
  };

  const handleDelete = (id) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "28px 16px 50px"
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "18px",
            marginBottom: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
          }}
        >
          <h2
            style={{
              marginBottom: "18px",
              fontSize: "24px",
              fontWeight: "700"
            }}
          >
            Admin Panel
          </h2>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap"
            }}
          >
            <Link to="/admin" style={btnStyle}>
              Dashboard
            </Link>

            <Link to="/admin/offers" style={btnStyle}>
              Ofertat
            </Link>

            <Link to="/admin/stats" style={btnStyle}>
              Statistikat
            </Link>

            <Link to="/admin/clients" style={btnStyle}>
              Klientët
            </Link>

            <Link to="/admin/public-clients" style={btnStyle}>
              Klientët tanë
            </Link>

            <Link to="/admin/payments" style={activeBtnStyle}>
              Pagesat
            </Link>

            <Link to="/admin/ad-requests" style={btnStyle}>
              Reklamo me ne
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <StatCard label="Totali i pagesave" value={stats.totalPayments} />
          <StatCard label="Shuma totale" value={`${stats.totalAmount} €`} />
          <StatCard label="Pagesat sot" value={stats.todayPayments} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) 1fr",
            gap: "20px"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              height: "fit-content"
            }}
          >
            <h3
              style={{
                marginBottom: "18px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              {editingId ? "Përditëso pagesën" : "Shto pagesë të re"}
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "14px" }}
            >
              <div>
                <label style={labelStyle}>Emri i klientit</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="p.sh. Ardit Krasniqi"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Shuma</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="p.sh. 100"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Data e pagesës</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Metoda e pagesës</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Cash">Cash</option>
                  <option value="Bankë">Bankë</option>
                  <option value="Kartelë">Kartelë</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Shënim</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Shënim rreth pagesës..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "6px"
                }}
              >
                <button type="submit" style={primaryBtnStyle}>
                  {editingId ? "Ruaj ndryshimet" : "Shto pagesën"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={secondaryBtnStyle}
                >
                  Pastro
                </button>
              </div>
            </form>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
            }}
          >
            <h3
              style={{
                marginBottom: "18px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              Historia e pagesave
            </h3>

            {payments.length === 0 ? (
              <div
                style={{
                  padding: "30px 16px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "14px",
                  color: "#64748b"
                }}
              >
                Nuk ka pagesa të regjistruara.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "10px"
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#0f172a"
                          }}
                        >
                          {payment.clientName}
                        </h4>

                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#64748b",
                            fontSize: "14px"
                          }}
                        >
                          {payment.paymentDate || "Pa datë"}
                        </p>
                      </div>

                      <div
                        style={{
                          fontWeight: "800",
                          fontSize: "20px",
                          color: "#16a34a"
                        }}
                      >
                        {payment.amount ? `${payment.amount} €` : "0 €"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "10px",
                        marginBottom: "14px"
                      }}
                    >
                      <InfoBox
                        label="Metoda e pagesës"
                        value={payment.paymentMethod || "-"}
                      />
                      <InfoBox
                        label="Data"
                        value={payment.paymentDate || "-"}
                      />
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "14px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#0f172a",
                          marginBottom: "6px"
                        }}
                      >
                        Shënim
                      </div>
                      <div
                        style={{
                          color: "#475569",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {payment.note || "Nuk ka shënim."}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >
                      <button
                        onClick={() => handleEdit(payment)}
                        style={secondaryBtnStyle}
                      >
                        Ndrysho
                      </button>

                      <button
                        onClick={() => handleDelete(payment.id)}
                        style={dangerBtnStyle}
                      >
                        Fshij
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "8px"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#0f172a"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "12px",
        padding: "12px"
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#64748b",
          marginBottom: "4px"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "#0f172a",
          wordBreak: "break-word"
        }}
      >
        {value}
      </div>
    </div>
  );
}

const btnStyle = {
  textDecoration: "none",
  background: "#0f172a",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600"
};

const activeBtnStyle = {
  ...btnStyle,
  background: "#2563eb"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#0f172a"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};

const primaryBtnStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};

const secondaryBtnStyle = {
  background: "#e2e8f0",
  color: "#0f172a",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};

const dangerBtnStyle = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};