import { useState } from 'react'
import Chat from './Chat'
import Faq from './Faq'
import Search from './Search'
import './Tabs.css'

const TABS = [
  { id: 'chat', label: 'Чат' },
  { id: 'search', label: 'Поиск' },
  { id: 'faq', label: 'FAQ' },
]

const TAB_CONTENT = {
  chat: <Chat />,
  search: <Search />,
  faq: <Faq />,
}

function Tabs() {
  const [active, setActive] = useState('chat')

  return (
    <div className="tabs">
      <div className="tabs__nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tabs__btn${active === tab.id ? ' tabs__btn--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs__content">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className="tabs__panel"
            style={{ display: active === tab.id ? 'block' : 'none' }}
          >
            {TAB_CONTENT[tab.id]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
