
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameBoard } from '@/components/GameBoard'
import { Lobby } from '@/components/Lobby'
import { Header } from '@/components/Header'
import { DemoShowcase } from '@/components/DemoShowcase'
import './App.css'
import './styles/global.css'

function App() {
  return (
    <Router>
      <div className="app flex-column">
        <Header />
        <main className="main-content flex-column">
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
