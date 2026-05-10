// import { useState, useEffect } from 'react'
// import Tabs from './components/Tabs'
// import BurgerMenu from './components/BurgerMenu'
// import DebugPanel from './components/DebugPanel'
// import TopicSelect from './components/TopicSelect'
// import MyChats from './components/MyChats'
// import InfoPanel from './components/InfoPanel'
// import { GroupProvider } from './context/GroupContext'
// import { useAuth } from './context/AuthContext'
// import { api } from './services/api'
// import { DEBUG, ANDROID_STUB } from './config'
// import './App.css'

function App() {
  // const { authFailed } = useAuth()
  // const [activePanel, setActivePanel] = useState(null)
  // const [generics, setGenerics] = useState(null)

  // useEffect(() => {
  //   api.get('/api/v1/generics/').then(setGenerics).catch(() => {})
  // }, [])

  // const handleMenuAction = (id) => {
  //   if (id === 'chats' || id === 'help' || id === 'bug') setActivePanel(id)
  // }

  // if (ANDROID_STUB && window.Telegram?.WebApp?.platform === 'android') {
  //   const initData = window.Telegram?.WebApp?.initData || '(пусто)'
  //   const fullUrl = window.location.href
  //   return (
  //     <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all' }}>
  //       <p><strong>platform:</strong> android</p>
  //       <p><strong>URL:</strong><br />{fullUrl}</p>
  //       <p><strong>initData:</strong><br />{initData}</p>
  //     </div>
  //   )
  // }
  
  // if (authFailed) {
  //   return (
  //     <div className="unavailable">
  //       <p>Приложение сейчас не доступно, приносим наши извинения</p>
  //     </div>
  //   )
  // }

  // return (
  //   <GroupProvider>
  //     <div className="container">
  //       <div className="main-area">
  //         <header className="header">
  //           <BurgerMenu onAction={handleMenuAction} />
  //         </header>
  //         <TopicSelect />
  //         <Tabs />
  //         {activePanel === 'chats' && (
  //           <MyChats onClose={() => setActivePanel(null)} />
  //         )}
  //         {activePanel === 'help' && (
  //           <InfoPanel title="Помощь" content={generics?.help_message} onClose={() => setActivePanel(null)} />
  //         )}
  //         {activePanel === 'bug' && (
  //           <InfoPanel title="Отправить баг" content={generics?.send_bug_message} onClose={() => setActivePanel(null)} />
  //         )}
  //       </div>
  //       {DEBUG && <DebugPanel />}
  //     </div>
  //   </GroupProvider>
  // )
  return <h1>Hello</h1>
}

export default App
