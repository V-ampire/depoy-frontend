import { useState, useEffect, useRef } from 'react'
import './BurgerMenu.css'

const MENU_ITEMS = [
  { id: 'chats', icon: '💬', label: 'Мои чаты' },
  { id: 'help', icon: '🙋', label: 'Помощь' },
  { id: 'bug', icon: '🐞', label: 'Отправить баг' },
]

function BurgerMenu({ onAction }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="burger" ref={menuRef}>
      <button
        className={`burger__btn${open ? ' burger__btn--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="burger__dropdown">
          <ul className="burger__list">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button className="burger__item" onClick={() => { setOpen(false); onAction?.(item.id) }}>
                  <span className="burger__item-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BurgerMenu
