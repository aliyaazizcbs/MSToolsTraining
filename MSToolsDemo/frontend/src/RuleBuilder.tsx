import { useState } from 'react'

type LightCondition = 'red' | 'green' | 'amber' | 'any'
type PedestriansCondition = 'crossing' | 'not-crossing' | 'either'
type Action = 'stop' | 'go' | 'wait' | 'slow-down'

interface Rule {
  conditionLight: LightCondition
  conditionPedestrians: PedestriansCondition
  action: Action
}

interface ScenarioResult {
  scenarioId: number
  description: string
  passed: boolean
  appliedAction: string
  correctAction: string
}

interface Scenario {
  id: number
  description: string
  light: string
  pedestriansCrossing: boolean
}

const LIGHT_OPTIONS: { value: LightCondition; label: string }[] = [
  { value: 'red',   label: '🔴 Red' },
  { value: 'green', label: '🟢 Green' },
  { value: 'amber', label: '🟡 Amber' },
  { value: 'any',   label: '🔘 Any light' },
]

const PEDESTRIANS_OPTIONS: { value: PedestriansCondition; label: string }[] = [
  { value: 'crossing',     label: '🚶 Pedestrians crossing' },
  { value: 'not-crossing', label: '✅ No pedestrians' },
  { value: 'either',       label: '❓ Either' },
]

const ACTION_OPTIONS: { value: Action; label: string }[] = [
  { value: 'stop',      label: '🛑 Stop' },
  { value: 'go',        label: '🚗 Go' },
  { value: 'wait',      label: '⏳ Wait' },
  { value: 'slow-down', label: '🐢 Slow down' },
]

const ACTION_LABELS: Record<string, string> = {
  stop:      '🛑 Stop',
  go:        '🚗 Go',
  wait:      '⏳ Wait',
  'slow-down': '🐢 Slow down',
  none:      '❌ No rule matched',
}

function pedestriansToApi(p: PedestriansCondition): boolean | null {
  if (p === 'crossing')     return true
  if (p === 'not-crossing') return false
  return null
}

const emptyRule = (): Rule => ({
  conditionLight: 'red',
  conditionPedestrians: 'either',
  action: 'stop',
})

export function RuleBuilder() {
  const [rules, setRules]     = useState<Rule[]>([emptyRule()])
  const [results, setResults] = useState<ScenarioResult[] | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Load scenario descriptions once
  const ensureScenarios = async () => {
    if (scenarios) return scenarios
    const res = await fetch('/api/scenarios')
    if (!res.ok) throw new Error('Could not load scenarios')
    const data: Scenario[] = await res.json()
    setScenarios(data)
    return data
  }

  const updateRule = (index: number, patch: Partial<Rule>) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r))
    setResults(null)
  }

  const addRule = () => {
    setRules(prev => [...prev, emptyRule()])
    setResults(null)
  }

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index))
    setResults(null)
  }

  const runScenarios = async () => {
    setLoading(true)
    setError(null)
    try {
      await ensureScenarios()
      const payload = {
        rules: rules.map(r => ({
          conditionLight: r.conditionLight,
          conditionPedestrians: pedestriansToApi(r.conditionPedestrians),
          action: r.action,
        })),
      }
      const res = await fetch('/api/scenarios/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const allPassed = results !== null && results.every(r => r.passed)

  return (
    <div className="card rb-card">
      <h2 className="section-title">🧠 IF / THEN Rule Builder</h2>
      <p className="rb-intro">
        Build a set of rules that tell the driver what to do. Rules are checked <strong>top to bottom</strong> — the first matching rule wins. Then hit <strong>Run scenarios</strong> to test them!
      </p>

      {/* Scenario context */}
      <div className="rb-scenarios-preview">
        <h3 className="rb-sub-title">📋 The 3 scenarios you'll be tested on:</h3>
        <ol className="rb-scenario-list">
          <li>🔴 Red light — no pedestrians</li>
          <li>🟢 Green light — crossing is clear</li>
          <li>🟢 Green light — pedestrian is crossing</li>
        </ol>
      </div>

      {/* Rule rows */}
      <div className="rb-rules">
        {rules.map((rule, i) => (
          <div key={i} className="rb-rule-row">
            <span className="rb-row-num">{i + 1}</span>

            <span className="rb-keyword">IF</span>
            <select
              className="rb-select"
              value={rule.conditionLight}
              onChange={e => updateRule(i, { conditionLight: e.target.value as LightCondition })}
              aria-label="Light condition"
            >
              {LIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <span className="rb-keyword">AND</span>
            <select
              className="rb-select"
              value={rule.conditionPedestrians}
              onChange={e => updateRule(i, { conditionPedestrians: e.target.value as PedestriansCondition })}
              aria-label="Pedestrians condition"
            >
              {PEDESTRIANS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <span className="rb-keyword">THEN</span>
            <select
              className="rb-select rb-select-action"
              value={rule.action}
              onChange={e => updateRule(i, { action: e.target.value as Action })}
              aria-label="Action"
            >
              {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {rules.length > 1 && (
              <button
                className="rb-remove-btn"
                onClick={() => removeRule(i)}
                type="button"
                aria-label={`Remove rule ${i + 1}`}
              >✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Add rule + Run */}
      <div className="rb-actions">
        <button className="rb-add-btn" onClick={addRule} type="button">
          + Add rule
        </button>
        <button className="increment-button rb-run-btn" onClick={runScenarios} disabled={loading} type="button">
          {loading ? 'Running...' : '▶ Run scenarios'}
        </button>
      </div>

      {error && <div className="error-message" role="alert"><span>{error}</span></div>}

      {/* Results */}
      {results && (
        <div className="rb-results" role="status" aria-live="polite">
          <h3 className="rb-sub-title">
            {allPassed ? '🎉 All scenarios passed!' : '🔍 Results:'}
          </h3>
          {results.map(r => (
            <div key={r.scenarioId} className={`rb-result-row ${r.passed ? 'rb-pass' : 'rb-fail'}`}>
              <span className="rb-result-icon">{r.passed ? '✅' : '❌'}</span>
              <div className="rb-result-detail">
                <p className="rb-result-desc">{r.description}</p>
                <p className="rb-result-actions">
                  Your rule said: <strong>{ACTION_LABELS[r.appliedAction]}</strong>
                  {!r.passed && <> &nbsp;— correct answer: <strong>{ACTION_LABELS[r.correctAction]}</strong></>}
                </p>
              </div>
            </div>
          ))}
          {allPassed && (
            <p className="rb-congrats">
              Your rules correctly handle all three scenarios — that's an <code>if / else if / else</code> chain in action! 🚦
            </p>
          )}
        </div>
      )}
    </div>
  )
}
