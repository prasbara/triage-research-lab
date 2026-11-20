export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)" }}>
      <div style={{
        background: "var(--background)",
        borderRadius: "var(--radius-card)",
        padding: "2.5rem",
        width: "100%",
        maxWidth: 400,
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-subtle)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "var(--accent)", margin: "0 auto 1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: 20, fontWeight: 700 }}>T</span>
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>Masuk ke TRIAGE Lab</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Gunakan akun penelitian Anda</p>
        </div>
        <form action="/api/auth/login" method="POST">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.375rem", color: "var(--text-primary)" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@institusi.ac.id"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                borderRadius: "var(--radius-input)",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                background: "var(--surface)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.375rem", color: "var(--text-primary)" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                borderRadius: "var(--radius-input)",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                background: "var(--surface)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-button)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Masuk
          </button>
        </form>
      </div>
    </main>
  )
}
