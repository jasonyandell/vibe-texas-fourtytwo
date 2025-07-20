import React from 'react'
import { SampleGameState } from './types'
import { GamePhase } from '@/types/texas42'
import styles from '../GameBoardSection.module.css'

interface GameStateControlsProps {
  gameStates: SampleGameState[]
  selectedGameState: SampleGameState
  onGameStateChange: (index: number) => void
}

export const GameStateControls: React.FC<GameStateControlsProps> = ({
  gameStates,
  selectedGameState,
  onGameStateChange
}) => {
  const formatPhase = (phase: GamePhase): string => {
    switch (phase) {
      case 'bidding': return 'Bidding Phase'
      case 'playing': return 'Playing Phase'
      case 'scoring': return 'Scoring Phase'
      case 'finished': return 'Game Finished'
      default: return 'Unknown Phase'
    }
  }

  return (
    <div className={styles.gameStateControls}>
      <h4>Game State Examples</h4>
      <p>Switch between different game scenarios:</p>
      <div className={styles.gameStateButtons}>
        {gameStates.map((gameState, index) => (
          <button
            key={index}
            onClick={() => onGameStateChange(index)}
            className={`${styles.gameStateButton} ${selectedGameState === gameState ? styles.active : ''}`}
            data-testid={`game-state-button-${index}`}
            aria-label={`Switch to ${formatPhase(gameState.phase)} scenario`}
          >
            <span className={styles.buttonPhase}>{formatPhase(gameState.phase)}</span>
            <span className={styles.buttonScore}>
              {gameState.scores.northSouth}-{gameState.scores.eastWest}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}