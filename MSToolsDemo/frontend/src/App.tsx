import { useState } from 'react'
import './App.css'

type LightState = 'red' | 'red-amber' | 'green' | 'amber'

interface ScenarioResult {
  scenarioId: number
  description: string
  passed: boolean
  appliedAction: string
  correctAction: string
}

const ACTION_LABELS: Record<string, string> = {
  stop: '🛑 Stop', go: '🚗 Go', wait: '⏳ Wait', 'slow-down': '🐢 Slow down', none: '❌ No rule matched',
}

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

  // Scenario tester state
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[] | null>(null)
  const [scenarioLoading, setScenarioLoading] = useState(false)
  const [scenarioError, setScenarioError] = useState<string | null>(null)

  const testRules = async () => {
    setScenarioLoading(true)
    setScenarioError(null)
    try {
      const res = await fetch('/api/scenarios/evaluate')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setScenarioResults(data.results)
    } catch (err) {
      setScenarioError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setScenarioLoading(false)
    }
  }

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

      {/* Scenario tester section */}
      <section className="rule-builder-section">
        <div className="section-intro">
          <h2 className="section-heading">Part 2 — IF / THEN Logic</h2>
          <p className="section-subheading">
            Three scenarios are loaded on the server. The rules in <code>ScenarioLogic.cs</code> are wrong — fix them, rebuild, then hit <strong>Test rules</strong>.
          </p>
        </div>

        <div className="card rb-card">
          <h3 className="rb-sub-title">📋 The 3 scenarios:</h3>
          <ol className="rb-scenario-list">
            <li>🔴 Red light — no pedestrians</li>
            <li>🟢 Green light — crossing is clear</li>
            <li>🟢 Green light — pedestrian is crossing</li>
          </ol>

          <div className="rb-actions">
            <button className="increment-button rb-run-btn" onClick={testRules} disabled={scenarioLoading} type="button">
              {scenarioLoading ? 'Testing...' : '▶ Test rules'}
            </button>
          </div>

          {scenarioError && <div className="error-message" role="alert"><span>{scenarioError}</span></div>}

          {scenarioResults && (
            <div className="rb-results" role="status" aria-live="polite">
              <h3 className="rb-sub-title">
                {scenarioResults.every(r => r.passed) ? '🎉 All scenarios passed!' : '🔍 Results:'}
              </h3>
              {scenarioResults.map(r => (
                <div key={r.scenarioId} className={`rb-result-row ${r.passed ? 'rb-pass' : 'rb-fail'}`}>
                  <span className="rb-result-icon">{r.passed ? '✅' : '❌'}</span>
                  <div className="rb-result-detail">
                    <p className="rb-result-desc">{r.description}</p>
                    <p className="rb-result-actions">
                      Rule said: <strong>{ACTION_LABELS[r.appliedAction] ?? r.appliedAction}</strong>
                      {!r.passed && <> — correct: <strong>{ACTION_LABELS[r.correctAction] ?? r.correctAction}</strong></>}
                    </p>
                  </div>
                </div>
              ))}
              {scenarioResults.every(r => r.passed) && (
                <p className="rb-congrats">
                  Your rules correctly handle all three scenarios — that's an <code>if / else if / else</code> chain in action! 🚦
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <footer className="app-footer">
        <p>MS Tools Demo — coding is about logic, not maths! 🎉</p>
      </footer>
    </div>
  )
}

export default App
