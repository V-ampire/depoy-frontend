import { useState, useRef } from 'react'
import { useGroup } from '../context/GroupContext'
import { api } from '../services/api'
import './Search.css'

const THINKING_PHRASES = [
  'Внимаю…',
  'Сверяюсь со свитками…',
  'Собираю смысл…',
  'Ищу ясность…',
  'Оттачиваю ответ…',
  'Следую пути…',
  'Постигаю суть…',
]

const PHRASE_INTERVAL = 2000

function buildDeeplink(tg_chat_id, tg_message_id, thread_id) {
  const channelId = String(tg_chat_id).replace(/^-100/, '')
  const base = `https://t.me/c/${channelId}/${tg_message_id}`
  return thread_id ? `${base}?thread=${thread_id}` : base
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function SearchResult({ msg }) {
  const deeplink = buildDeeplink(msg.tg_chat_id, msg.tg_message_id, msg.thread_id)

  return (
    <div className="search-result">
      <p className="search-result__text">{msg.text ?? '—'}</p>

      {msg.reactions.length > 0 && (
        <div className="search-result__reactions">
          {msg.reactions.map((r, i) => (
            <span key={i} className="search-result__reaction">
              {r.emoticon} <span className="search-result__reaction-count">{r.count}</span>
            </span>
          ))}
        </div>
      )}

      <div className="search-result__footer">
        <span className="search-result__date">{formatDate(msg.pub_date)}</span>
        <a
          className="search-result__link"
          href={deeplink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть в Telegram ↗
        </a>
      </div>
    </div>
  )
}

function Search() {
  const { group, activeTopic } = useGroup()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [thinking, setThinking] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const phraseIndexRef = useRef(0)
  const phraseTimerRef = useRef(null)

  const startThinking = () => {
    phraseIndexRef.current = 0
    setThinking(THINKING_PHRASES[0])
    phraseTimerRef.current = setInterval(() => {
      phraseIndexRef.current += 1
      if (phraseIndexRef.current < THINKING_PHRASES.length) {
        setThinking(THINKING_PHRASES[phraseIndexRef.current])
      }
    }, PHRASE_INTERVAL)
  }

  const stopThinking = () => {
    clearInterval(phraseTimerRef.current)
    setThinking(null)
  }

  const search = async () => {
    const q = query.trim()
    if (!q || isLoading || !group) return

    setIsLoading(true)
    setError(null)
    setResults(null)
    startThinking()

    try {
      const groupId = group.id
      console.debug('[Search] group:', group, 'activeTopic:', activeTopic)

      const params = new URLSearchParams({ query: q })
      if (activeTopic?.id) params.set('tg_topic_id', activeTopic.id)
      const url = `/api/v1/search/${groupId}/?${params}`
      console.debug('[Search] url:', url)

      const data = await api.get(url)
      setResults(data)
    } catch (err) {
      console.error('[Search] error:', err)
      setError(`Ой… что-то пошло не так. Даже сенсей иногда спотыкается. Повтори попытку? (${err.status ?? err.message})`)
    } finally {
      stopThinking()
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search()
  }

  return (
    <div className="search">
      <div className="search__input-row">
        <input
          className="search__input"
          type="text"
          placeholder="Введите запрос…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="search__btn" onClick={search} disabled={isLoading}>
          Найти
        </button>
      </div>

      {thinking && (
        <div className="search__thinking">{thinking}</div>
      )}

      {error && (
        <div className="search__error">{error}</div>
      )}

      {results !== null && !thinking && (
        results.length === 0
          ? <div className="search__empty">Ничего не найдено</div>
          : <div className="search__results">
              {results.map((msg, i) => (
                <SearchResult key={i} msg={msg} />
              ))}
            </div>
      )}
    </div>
  )
}

export default Search
