import React from 'react'
import { SampleGameState } from './types'
import { GamePhase, DominoSuit } from '@/types/texas42'
import styles from '../GameBoardSection.module.css'

interface ScoreStatusDisplayProps {
  gameState: SampleGameState
}

export const ScoreStatusDisplay: React.FC<ScoreStatusDisplayProps> = ({ gameState }) => {
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
            <span className={styles.phaseValue}>{formatPhase(gameState.phase)}</span>
          </div>

          {gameState.currentBid && (
            <div className={styles.currentBid}>
              <span className={styles.bidLabel}>Current Bid:</span>
              <span className={styles.bidValue}>
                {gameState.currentBid.amount} - {formatTrumpSuit(gameState.currentBid.trump)}
              </span>
              <span className={styles.bidder}>by {gameState.currentBid.bidder}</span>
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
              <span className={styles.scoreValue}>{gameState.scores.northSouth}</span>
              <span className={styles.gameScoreValue}>Games: {gameState.gameScore.northSouth}</span>
            </div>
            <div className={styles.scoreDivider}>vs</div>
            <div className={styles.teamScore}>
              <span className={styles.teamName}>East-West</span>
              <span className={styles.scoreValue}>{gameState.scores.eastWest}</span>
              <span className={styles.gameScoreValue}>Games: {gameState.gameScore.eastWest}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}