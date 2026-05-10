import { useState, useEffect } from 'react'
import { api } from '../services/api'
import Chat from './Chat'
import './MyChats.css'

function ChatListItem({ chat, onClick }) {
  return (
    <button className="my-chats__item" onClick={onClick}>
      <span className="my-chats__item-title">{chat.title}</span>
      <span className="my-chats__item-meta">{chat.history.length} сообщ.</span>
    </button>
  )
}

function MyChats({ onClose }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    api.get('/api/v1/chats/')
      .then(setChats)
      .catch(() => setError('Не удалось загрузить чаты'))
      .finally(() => setLoading(false))
  }, [])

  if (selectedChat) {
    const initialMessages = selectedChat.history.map((msg) => ({
      id: msg.sub_chat_id,
      role: msg.role,
      text: msg.text,
    }))

    return (
      <div className="my-chats">
        <div className="my-chats__header">
          <button className="my-chats__back" onClick={() => setSelectedChat(null)}>
            ← Назад
          </button>
          <span className="my-chats__header-title">{selectedChat.title}</span>
          <button className="my-chats__close" onClick={onClose}>✕</button>
        </div>
        <div className="my-chats__chat">
          <Chat initialMessages={initialMessages} initialChatId={selectedChat.id} />
        </div>
      </div>
    )
  }

  return (
    <div className="my-chats">
      <div className="my-chats__header">
        <span className="my-chats__header-title">Мои чаты</span>
        <button className="my-chats__close" onClick={onClose}>✕</button>
      </div>
      <div className="my-chats__list">
        {loading && <p className="my-chats__empty">Загрузка…</p>}
        {error && <p className="my-chats__empty">{error}</p>}
        {!loading && !error && chats.length === 0 && (
          <p className="my-chats__empty">Чатов пока нет</p>
        )}
        {chats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} onClick={() => setSelectedChat(chat)} />
        ))}
      </div>
    </div>
  )
}

export default MyChats
