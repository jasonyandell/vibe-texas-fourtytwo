import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { LobbyStateProvider } from './contexts/LobbyStateContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LobbyStateProvider>
      <App />
    </LobbyStateProvider>
  </React.StrictMode>,
)
