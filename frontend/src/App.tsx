
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameBoard } from '@/components/GameBoard'
import { Lobby } from '@/components/Lobby'
import { Header } from '@/components/Header'
import './App.css'

function App() {
  return (
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
  )
}

export default App
