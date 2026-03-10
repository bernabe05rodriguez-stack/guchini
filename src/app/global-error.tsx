"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui", padding: "2rem" }}>
        <h2>Algo salió mal</h2>
        <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto", whiteSpace: "pre-wrap" }}>
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
        <button onClick={reset} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
          Reintentar
        </button>
      </body>
    </html>
  )
}
