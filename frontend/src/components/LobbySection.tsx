import React, { useState } from 'react'
import { CreateGameModal } from './lobby/CreateGameModal'
import { GameCard } from './lobby/GameCard'
import { EmptyState } from './lobby/EmptyState'
import { Button } from './ui'
import type { LobbyGame } from '@/types/texas42'
import styles from './LobbySection.module.css'

export const LobbySection: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(true)
  const [demoGames, setDemoGames] = useState<LobbyGame[]>([])

  // Mock game data for demonstration
  const createMockGame = (name: string, playerCount: number, status: 'waiting' | 'playing' | 'finished'): LobbyGame => ({
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    playerCount,
    maxPlayers: 4,
    status,
    gameCode: generateGameCode(),
    createdAt: new Date().toISOString(),
    creator: 'Demo User',
    players: []
  })

  const generateGameCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleCreateGame = (gameName: string) => {
    const newGame = createMockGame(gameName, 1, 'waiting')
    setDemoGames([...demoGames, newGame])
    setShowEmptyState(false)
  }

  const addPresetGames = () => {
    const presetGames = [
      createMockGame('Friday Night 42', 3, 'waiting'),
      createMockGame('Tournament Round 1', 4, 'playing'),
      createMockGame('Beginner Friendly', 2, 'waiting'),
      createMockGame('Championship Finals', 4, 'finished')
    ]
    setDemoGames(presetGames)
    setShowEmptyState(false)
  }

  const clearGames = () => {
    setDemoGames([])
    setShowEmptyState(true)
  }

  return (
    <div className={styles.lobbySection} data-testid="lobby-section">
      <div className={styles.header}>
        <h3>Lobby Components</h3>
        <div className={styles.controls}>
          <Button 
            variant="secondary" 
            onClick={() => setShowCreateModal(true)}
            disabled={showCreateModal}
          >
            Show Create Modal
          </Button>
          <Button 
            variant="secondary" 
            onClick={addPresetGames}
            disabled={demoGames.length > 0}
          >
            Add Sample Games
          </Button>
          <Button 
            variant="ghost" 
            onClick={clearGames}
            disabled={demoGames.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Empty State Demo */}
      {showEmptyState && demoGames.length === 0 && (
        <div className={styles.componentDemo}>
          <h4>Empty State</h4>
          <EmptyState 
            onCreateGame={() => setShowCreateModal(true)}
          />
        </div>
      )}

      {/* Game Cards Demo */}
      {demoGames.length > 0 && (
        <div className={styles.componentDemo}>
          <h4>Game Cards ({demoGames.length})</h4>
          <div className={styles.gameCardGrid}>
            {demoGames.map(game => (
              <GameCard 
                key={game.id}
                game={game}
                currentUserId="demo-user"
                onJoinGame={(gameId) => console.log('Join game:', gameId)}
                onLeaveGame={(gameId) => console.log('Leave game:', gameId)}
                onSpectateGame={(gameId) => console.log('Spectate game:', gameId)}
                onMarkReady={(gameId) => console.log('Mark ready:', gameId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Game Modal Demo */}
      {showCreateModal && (
        <div className={styles.componentDemo}>
          <CreateGameModal 
            onCreateGame={(name) => {
              handleCreateGame(name)
              setShowCreateModal(false)
            }}
            onClose={() => setShowCreateModal(false)}
          />
        </div>
      )}

      {/* Component Showcase Info */}
      <div className={styles.showcaseInfo}>
        <h4>Story 002 Components</h4>
        <ul>
          <li><strong>CreateGameModal</strong> - Form with validation, error handling, and loading states</li>
          <li><strong>GameCard</strong> - Displays game info, player count, and game code</li>
          <li><strong>EmptyState</strong> - Shown when no games exist in lobby</li>
          <li><strong>Game Code</strong> - 6-character codes (A-Z, 0-9) for sharing games</li>
        </ul>
      </div>
    </div>
  )
}