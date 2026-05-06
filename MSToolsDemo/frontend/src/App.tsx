import { useState } from 'react'
import './App.css'

type LightState = 'red' | 'red-amber' | 'green' | 'amber'

const LIGHT_LABELS: Record<LightState, string> = {
  'red':       'RED — Stop',
  'red-amber': 'RED + AMBER — Get ready',
  'green':     'GREEN — Go',
  'amber':     'AMBER — Slow down',
}

function App() {
  const [light, setLight] = useState<LightState>('red')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [broken, setBroken] = useState(true)

  const advance = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/trafficlight/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: light }),
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()
      setLight(data.light as LightState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🚦 Traffic Light Demo</h1>
        <p className="app-subtitle">
          {broken
            ? '⚠️ The logic is broken — press Next and see what happens!'
            : '✅ Logic fixed — the light now follows the correct UK sequence!'}
        </p>
      </header>

      <main className="main-content">
        <div className="card tl-card">

          {/* Traffic light housing */}
          <div className="tl-housing" aria-label={`Current light: ${LIGHT_LABELS[light]}`}>
            <div className={`tl-bulb tl-red    ${light === 'red'   || light === 'red-amber' ? 'tl-on' : ''}`} aria-hidden="true" />
            <div className={`tl-bulb tl-amber  ${light === 'amber' || light === 'red-amber' ? 'tl-on' : ''}`} aria-hidden="true" />
            <div className={`tl-bulb tl-green  ${light === 'green' ? 'tl-on' : ''}`} aria-hidden="true" />
          </div>

          {/* State label */}
          <p className="tl-label" role="status" aria-live="polite">
            {LIGHT_LABELS[light]}
          </p>

          {/* Error */}
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* Next button */}
          <button
            className="increment-button"
            onClick={advance}
            disabled={loading}
            type="button"
          >
            {loading ? 'Thinking...' : 'Next →'}
          </button>

          {/* Demo helper toggle */}
          <button
            className="toggle-hint-button"
            onClick={() => setBroken(b => !b)}
            type="button"
          >
            {broken ? '👩‍💻 I\'ve fixed the code — mark as working' : '🐛 Reset to broken for demo'}
          </button>
        </div>

        {/* Code block hint card */}
        <div className="card hint-card">
          <h2 className="section-title">🧩 The broken code</h2>
          <p className="hint-intro">
            The server has one method called <code>GetNextLight</code>. All it does is look up
            the <em>current</em> light in a list and return the <em>next</em> one. The list is
            in the wrong order — that's the only bug!
          </p>
          <pre className="code-block">
{`// TrafficLightLogic.cs  (server-side)

private static readonly string[] _sequence =
[
    "red",       // ← Card 1
    "green",     // ← Card 2  (wrong!)
    "amber",     // ← Card 3  (wrong!)
    "red-amber", // ← Card 4  (wrong!)
];

public static string GetNextLight(string current)
{
    var index = Array.IndexOf(_sequence, current);
    if (index == -1) return "red";
    return _sequence[(index + 1) % _sequence.Length];
}`}
          </pre>
          <p className="hint-fix">
            ✅ <strong>Correct order:</strong> &nbsp;
            <code>"red"</code> → <code>"red-amber"</code> → <code>"green"</code> → <code>"amber"</code> → (back to red)
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>MS Tools Demo — coding is about logic, not maths! 🎉</p>
      </footer>
    </div>
  )
}

export default App
