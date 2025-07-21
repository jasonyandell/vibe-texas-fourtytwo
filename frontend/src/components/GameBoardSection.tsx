import React, { useState } from 'react'
import { CenterPlayArea } from './board/CenterPlayArea'
import { TrickStacks } from './board/TrickStacks'
import { ScoreStatusDisplay } from './board/ScoreStatusDisplay'
import { GameStateControls } from './board/GameStateControls'
import { sampleTricks, sampleGameStates } from './board/sampleData'
import { SampleGameState } from './board/types'
import styles from './GameBoardSection.module.css'

export const GameBoardSection: React.FC = () => {
  const [currentTrickIndex, setCurrentTrickIndex] = useState(0)
  const [selectedGameState, setSelectedGameState] = useState<SampleGameState>(sampleGameStates[0])
  const currentTrick = sampleTricks[currentTrickIndex]

  const handleNextTrick = () => {
    setCurrentTrickIndex((prev) => (prev + 1) % sampleTricks.length)
  }

  const handlePrevTrick = () => {
    setCurrentTrickIndex((prev) => (prev - 1 + sampleTricks.length) % sampleTricks.length)
  }

  const handleGameStateChange = (index: number) => {
    setSelectedGameState(sampleGameStates[index])
  }

  return (
    <div 
      className={styles.gameBoardSection}
      data-testid="game-board-section-container"
      aria-label="Game board elements showcase"
    >
      <div className={styles.header}>
        <h3>Game Board & Trick Play</h3>
        <p>Explore the center play area, trick stacks, and scoring displays that make up the active gameplay experience.</p>
      </div>

      <div className={styles.mainContent}>
        <CenterPlayArea
          currentTrick={currentTrick}
          onPrevTrick={handlePrevTrick}
          onNextTrick={handleNextTrick}
          currentTrickIndex={currentTrickIndex}
          totalTricks={sampleTricks.length}
        />

        <TrickStacks gameState={selectedGameState} />

        <ScoreStatusDisplay gameState={selectedGameState} />
      </div>

      <GameStateControls
        gameStates={sampleGameStates}
        selectedGameState={selectedGameState}
        onGameStateChange={handleGameStateChange}
      />

      {/* Accessibility announcements */}
      <div
        data-testid="trick-announcer"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        Current trick: {currentTrick.name}. {currentTrick.description}. Winner: {currentTrick.winnerName}.
      </div>
    </div>
  )
}
