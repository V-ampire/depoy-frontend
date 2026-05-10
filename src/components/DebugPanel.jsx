import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGroup } from '../context/GroupContext'
import './DebugPanel.css'

function DebugPanel() {
  const tg = window.Telegram?.WebApp
  const platform = tg?.platform ?? 'unknown'
  const initData = tg?.initData || '(empty)'
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { tokens, authError } = useAuth()
  const { group, groupError, groupLoading, groupRequestUrl } = useGroup()

  const queryParams = Object.fromEntries(new URLSearchParams(window.location.search))

  const copy = () => {
    navigator.clipboard.writeText(initData).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="debug-panel">
      <button className="debug-panel__toggle" onClick={() => setExpanded((v) => !v)}>
        <span>🛠 Debug</span>
        <span className="debug-panel__toggle-arrow">{expanded ? '▼' : '▲'}</span>
      </button>

      {expanded && (
        <div className="debug-panel__body">
          <div className="debug-panel__row">
            <span className="debug-panel__label">Platform:</span>
            <span className="debug-panel__value">{platform}</span>
          </div>
          <div className="debug-panel__row debug-panel__row--column">
            <div className="debug-panel__row debug-panel__row--space-between">
              <span className="debug-panel__label">initData:</span>
              <button className="debug-panel__copy" onClick={copy}>
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className="debug-panel__pre">{initData}</pre>
          </div>
          <div className="debug-panel__row debug-panel__row--column">
            <span className="debug-panel__label">Query params:</span>
            <pre className="debug-panel__pre">
              {Object.keys(queryParams).length ? JSON.stringify(queryParams, null, 2) : '(empty)'}
            </pre>
          </div>
          <div className="debug-panel__row debug-panel__row--column">
            <span className="debug-panel__label">Auth tokens:</span>
            {authError
              ? <pre className="debug-panel__pre debug-panel__pre--error">{JSON.stringify(authError, null, 2)}</pre>
              : <pre className="debug-panel__pre">{tokens ? JSON.stringify(tokens, null, 2) : '(ожидание…)'}</pre>
            }
          </div>
          <div className="debug-panel__row debug-panel__row--column">
            <span className="debug-panel__label">Group request:</span>
            <pre className="debug-panel__pre">{groupRequestUrl ?? '(нет запроса)'}</pre>
          </div>
          <div className="debug-panel__row debug-panel__row--column">
            <span className="debug-panel__label">Group:</span>
            {groupError
              ? <pre className="debug-panel__pre debug-panel__pre--error">{JSON.stringify(groupError, null, 2)}</pre>
              : <pre className="debug-panel__pre">{groupLoading ? '(загрузка…)' : group ? JSON.stringify(group, null, 2) : '(нет данных)'}</pre>
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default DebugPanel
