
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameBoard } from '@/components/GameBoard'
import { Lobby } from '@/components/Lobby'
import { Header } from '@/components/Header'
import { LobbyStateProvider } from '@/contexts/LobbyStateContext'
import './App.css'

function App() {
  return (
    <LobbyStateProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/game/:gameId" element={<GameBoard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LobbyStateProvider>
  )
}

export default App
