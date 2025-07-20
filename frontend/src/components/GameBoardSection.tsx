import React, { useState } from 'react'
import { DominoComponent } from './DominoComponent'
import { createFullDominoSet, Domino, DominoSuit, GamePhase, PlayerPosition } from '@/types/texas42'
import styles from './GameBoardSection.module.css'

// Sample trick data for demonstration
export interface SampleTrick {
  id: string
  name: string
  description: string
  dominoes: Array<{
    domino: Domino
    position: PlayerPosition
    playerName: string
  }>
  winner: PlayerPosition
  winnerName: string
}

// Sample game state for demonstration
export interface SampleGameState {
  phase: GamePhase
  currentBid?: { amount: number; trump: DominoSuit; bidder: string }
  scores: { northSouth: number; eastWest: number }
  gameScore: { northSouth: number; eastWest: number }
  tricksWon: { northSouth: number; eastWest: number }
}

export const GameBoardSection: React.FC = () => {
  const [currentTrickIndex, setCurrentTrickIndex] = useState(0)

  // Sample tricks for demonstration
  const sampleTricks: SampleTrick[] = [
    {
      id: 'trick-1',
      name: 'Opening Trick',
      description: 'First trick of the hand with mixed suits',
      dominoes: [
        { domino: { id: '6-5', high: 6, low: 5, pointValue: 10, isCountDomino: true }, position: 'north', playerName: 'North' },
        { domino: { id: '4-2', high: 4, low: 2, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' },
        { domino: { id: '6-4', high: 6, low: 4, pointValue: 0, isCountDomino: false }, position: 'south', playerName: 'South' },
        { domino: { id: '3-1', high: 3, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' }
      ],
      winner: 'north',
      winnerName: 'North'
    },
    {
      id: 'trick-2', 
      name: 'Trump Trick',
      description: 'Trick won with trump dominoes (sixes)',
      dominoes: [
        { domino: { id: '5-3', high: 5, low: 3, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' },
        { domino: { id: '6-6', high: 6, low: 6, pointValue: 10, isCountDomino: true }, position: 'south', playerName: 'South' },
        { domino: { id: '2-1', high: 2, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' },
        { domino: { id: '6-0', high: 6, low: 0, pointValue: 0, isCountDomino: false }, position: 'north', playerName: 'North' }
      ],
      winner: 'south',
      winnerName: 'South'
    },
    {
      id: 'trick-3',
      name: 'Count Domino Trick', 
      description: 'High-value trick with multiple count dominoes',
      dominoes: [
        { domino: { id: '5-5', high: 5, low: 5, pointValue: 10, isCountDomino: true }, position: 'south', playerName: 'South' },
        { domino: { id: '6-1', high: 6, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' },
        { domino: { id: '5-0', high: 5, low: 0, pointValue: 5, isCountDomino: true }, position: 'north', playerName: 'North' },
        { domino: { id: '4-4', high: 4, low: 4, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' }
      ],
      winner: 'south',
      winnerName: 'South'
    }
  ]

  // Sample game states for demonstration
  const sampleGameStates: SampleGameState[] = [
    {
      phase: 'playing',
      currentBid: { amount: 32, trump: 'sixes', bidder: 'North' },
      scores: { northSouth: 15, eastWest: 8 },
      gameScore: { northSouth: 2, eastWest: 1 },
      tricksWon: { northSouth: 3, eastWest: 2 }
    },
    {
      phase: 'scoring',
      currentBid: { amount: 35, trump: 'fours', bidder: 'East' },
      scores: { northSouth: 28, eastWest: 14 },
      gameScore: { northSouth: 2, eastWest: 2 },
      tricksWon: { northSouth: 4, eastWest: 3 }
    },
    {
      phase: 'finished',
      currentBid: { amount: 42, trump: 'blanks', bidder: 'South' },
      scores: { northSouth: 42, eastWest: 0 },
      gameScore: { northSouth: 3, eastWest: 2 },
      tricksWon: { northSouth: 7, eastWest: 0 }
    }
  ]

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

  const formatPhase = (phase: GamePhase): string => {
    switch (phase) {
      case 'bidding': return 'Bidding Phase'
      case 'playing': return 'Playing Phase'
      case 'scoring': return 'Scoring Phase'
      case 'finished': return 'Game Finished'
      default: return 'Unknown Phase'
    }
  }

  const formatTrumpSuit = (trump: DominoSuit): string => {
    const trumpLabels: Record<DominoSuit, string> = {
      'blanks': 'Blanks (0s)',
      'ones': 'Ones (1s)',
      'twos': 'Twos (2s)',
      'threes': 'Threes (3s)',
      'fours': 'Fours (4s)',
      'fives': 'Fives (5s)',
      'sixes': 'Sixes (6s)',
      'doubles': 'Doubles'
    }
    return trumpLabels[trump] || trump
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
        {/* Center Play Area Section */}
        <div className={styles.centerPlaySection}>
          <h4>Center Play Area</h4>
          <p>The "pitcher's mound" where the current trick is displayed:</p>
          
          <div 
            className={styles.centerPlayArea}
            data-testid="demo-center-play-area"
            role="region"
            aria-label="Current trick display"
          >
            <div className={styles.trickHeader}>
              <h5>{currentTrick.name}</h5>
              <p>{currentTrick.description}</p>
              <div className={styles.trickWinner}>
                Winner: <strong>{currentTrick.winnerName}</strong>
              </div>
            </div>

            <div 
              className={styles.trickDominoes}
              data-testid="current-trick-dominoes"
              role="group"
              aria-label="Dominoes in current trick"
            >
              {currentTrick.dominoes.map((play, _index) => (
                <div 
                  key={`${play.position}-${play.domino.id}`}
                  className={`${styles.playedDomino} ${styles[`position${play.position.charAt(0).toUpperCase() + play.position.slice(1)}`]}`}
                  data-testid={`played-domino-${play.position}`}
                >
                  <DominoComponent 
                    domino={play.domino}
                    showPointValue={true}
                    highlightCount={play.domino.isCountDomino}
                    className={styles.trickDomino}
                  />
                  <span className={styles.playerLabel}>
                    {play.playerName}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.trickControls}>
              <button 
                onClick={handlePrevTrick}
                className={styles.trickButton}
                data-testid="prev-trick-button"
                aria-label="Show previous trick example"
              >
                ← Previous
              </button>
              <span className={styles.trickCounter}>
                {currentTrickIndex + 1} of {sampleTricks.length}
              </span>
              <button 
                onClick={handleNextTrick}
                className={styles.trickButton}
                data-testid="next-trick-button"
                aria-label="Show next trick example"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Trick Stacks Section */}
        <div className={styles.trickStacksSection}>
          <h4>Trick Stacks</h4>
          <p>Visual stacks of captured tricks for each partnership:</p>

          <div className={styles.trickStacksContainer}>
            <div
              className={styles.partnershipStack}
              data-testid="demo-trick-stack-north-south"
            >
              <h5>North-South Partnership</h5>
              <div className={styles.stackInfo}>
                <span className={styles.trickCount}>
                  Tricks: {selectedGameState.tricksWon.northSouth}
                </span>
                <span className={styles.stackPoints}>
                  Points: {selectedGameState.scores.northSouth}
                </span>
              </div>
              <div className={styles.trickStackDisplay}>
                {Array.from({ length: selectedGameState.tricksWon.northSouth }, (_, i) => (
                  <div
                    key={`ns-trick-${i}`}
                    className={styles.trickStackItem}
                    data-testid={`trick-stack-item-ns-${i}`}
                  >
                    <div className={styles.stackedDominoes}>
                      {/* Show sample dominoes for visual effect */}
                      <DominoComponent
                        domino={{ id: `stack-${i}-1`, high: 6, low: 5, pointValue: 10, isCountDomino: true }}
                        orientation="vertical"
                        className={styles.stackedDomino}
                        faceDown={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={styles.partnershipStack}
              data-testid="demo-trick-stack-east-west"
            >
              <h5>East-West Partnership</h5>
              <div className={styles.stackInfo}>
                <span className={styles.trickCount}>
                  Tricks: {selectedGameState.tricksWon.eastWest}
                </span>
                <span className={styles.stackPoints}>
                  Points: {selectedGameState.scores.eastWest}
                </span>
              </div>
              <div className={styles.trickStackDisplay}>
                {Array.from({ length: selectedGameState.tricksWon.eastWest }, (_, i) => (
                  <div
                    key={`ew-trick-${i}`}
                    className={styles.trickStackItem}
                    data-testid={`trick-stack-item-ew-${i}`}
                  >
                    <div className={styles.stackedDominoes}>
                      {/* Show sample dominoes for visual effect */}
                      <DominoComponent
                        domino={{ id: `stack-${i}-2`, high: 4, low: 3, pointValue: 0, isCountDomino: false }}
                        orientation="vertical"
                        className={styles.stackedDomino}
                        faceDown={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Display Section */}
        <div className={styles.scoreDisplaySection}>
          <h4>Score & Game Status</h4>
          <p>Current scores, game phase, and bid information:</p>

          <div className={styles.scoreDisplayContainer}>
            <div
              className={styles.gameStatusCard}
              data-testid="demo-game-status"
            >
              <div className={styles.gamePhase}>
                <span className={styles.phaseLabel}>Phase:</span>
                <span className={styles.phaseValue}>{formatPhase(selectedGameState.phase)}</span>
              </div>

              {selectedGameState.currentBid && (
                <div className={styles.currentBid}>
                  <span className={styles.bidLabel}>Current Bid:</span>
                  <span className={styles.bidValue}>
                    {selectedGameState.currentBid.amount} - {formatTrumpSuit(selectedGameState.currentBid.trump)}
                  </span>
                  <span className={styles.bidder}>by {selectedGameState.currentBid.bidder}</span>
                </div>
              )}
            </div>

            <div
              className={styles.scoresCard}
              data-testid="demo-scores-display"
            >
              <h5>Current Hand Scores</h5>
              <div className={styles.scoreGrid}>
                <div className={styles.teamScore}>
                  <span className={styles.teamName}>North-South</span>
                  <span className={styles.scoreValue}>{selectedGameState.scores.northSouth}</span>
                  <span className={styles.gameScoreValue}>Games: {selectedGameState.gameScore.northSouth}</span>
                </div>
                <div className={styles.scoreDivider}>vs</div>
                <div className={styles.teamScore}>
                  <span className={styles.teamName}>East-West</span>
                  <span className={styles.scoreValue}>{selectedGameState.scores.eastWest}</span>
                  <span className={styles.gameScoreValue}>Games: {selectedGameState.gameScore.eastWest}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game State Controls */}
      <div className={styles.gameStateControls}>
        <h4>Game State Examples</h4>
        <p>Switch between different game scenarios:</p>
        <div className={styles.gameStateButtons}>
          {sampleGameStates.map((gameState, index) => (
            <button
              key={index}
              onClick={() => handleGameStateChange(index)}
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
