import { useState, useRef, useEffect } from 'react'
import { WELCOME_TEXT } from '../config'
import { useGroup } from '../context/GroupContext'
import { api } from '../services/api'
import './Chat.css'

const WELCOME_MESSAGE = {
  id: 0,
  role: 'assistant',
  text: WELCOME_TEXT,
  welcome: true,
}

const RATINGS = [
  { value: 'miss', emoji: '🪨', label: 'Мимо' },
  { value: 'close', emoji: '🌱', label: 'Близко' },
  { value: 'exact', emoji: '🗡', label: 'Точно' },
]

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

function Chat({ initialMessages, initialChatId } = {}) {
  const { group, activeTopic } = useGroup()
  const [messages, setMessages] = useState(() => initialMessages ?? [WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [ratings, setRatings] = useState({})
  const [thinking, setThinking] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatIdRef = useRef(initialChatId ?? null)
  const bottomRef = useRef(null)
  const phraseIndexRef = useRef(0)
  const phraseTimerRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

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

  const isFirstMessage = () => chatIdRef.current === null

  const buildBody = (text) => ({
    query: text,
    tg_group_id: group.id,
    tg_topic_id: activeTopic?.id ?? null,
    from_tg_message_id: null,
  })

  const sendFirstMessage = async (text) => {
    const data = await api.post('/api/v1/chats/', buildBody(text))
    chatIdRef.current = data.chat_id
    return data.answer.text
  }

  const sendNextMessage = async (text) => {
    const data = await api.post(`/api/v1/chats/${chatIdRef.current}`, buildBody(text))
    return data.answer.text
  }

  const send = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }])
    setInput('')
    setIsLoading(true)
    startThinking()

    try {
      const reply = isFirstMessage()
        ? await sendFirstMessage(text)
        : await sendNextMessage(text)

      stopThinking()
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }])
    } catch (err) {
      stopThinking()
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Ой… что-то пошло не так. Даже сенсей иногда спотыкается. Повтори попытку?',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') send()
  }

  const rate = (msgId, value) => {
    setRatings((prev) => ({ ...prev, [msgId]: value }))
  }

  return (
    <div className="chat">
      <div className="chat__messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat__message chat__message--${msg.role}`}>
            <div className="chat__bubble">{msg.text}</div>
            {msg.role === 'assistant' && !msg.welcome && (
              <div className="chat__rating">
                <span className="chat__rating-label">Буду благодарен за ваше мнение — так я совершенствуюсь.</span>
                <div className="chat__rating-btns">
                  {RATINGS.map((r) => (
                    <button
                      key={r.value}
                      className={`chat__rating-btn${ratings[msg.id] === r.value ? ' chat__rating-btn--active' : ''}`}
                      onClick={() => rate(msg.id, r.value)}
                    >
                      {r.emoji} {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="chat__message chat__message--assistant">
            <div className="chat__bubble chat__bubble--thinking">{thinking}</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat__input-row">
        <input
          className="chat__input"
          type="text"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="chat__send" onClick={send} disabled={isLoading}>
          Отправить
        </button>
      </div>
    </div>
  )
}

export default Chat
