
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameBoard } from '@/components/GameBoard'
import { Lobby } from '@/components/Lobby'
import { Header } from '@/components/Header'
import { DemoShowcase } from '@/components/DemoShowcase'
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
            <Route path="/demo" element={<DemoShowcase />} />
            <Route path="/demo/:section" element={<DemoShowcase />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
