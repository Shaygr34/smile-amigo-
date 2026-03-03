export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Page Not Found</h1>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>This wave has passed.</p>
          <a href="/en" style={{ color: "#FACC15", fontWeight: 600 }}>Back to Home</a>
        </div>
      </body>
    </html>
  );
}
