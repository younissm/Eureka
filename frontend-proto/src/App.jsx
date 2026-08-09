import { useMemo, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [response, setResponse] = useState(null)
  const endpoint = useMemo(() => `${apiUrl.replace(/\/$$/, '')}/api/products/`, [apiUrl])

  async function checkApi() {
    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      setResponse(`Status ${res.status} • ${Array.isArray(data) ? `${data.length} products` : JSON.stringify(data)}`)
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <h1>Eureka Frontend Prototype</h1>
        <p>This is a minimal React + Vite deployment prototype built in <strong>frontend-proto</strong>.</p>
        <p>Backend API URL: <code>{apiUrl}</code></p>
        <button type="button" onClick={checkApi} className="action-button">
          Check Backend /api/products/
        </button>
        {response && <div className="response-box">{response}</div>}
      </section>
    </main>
  )
}
