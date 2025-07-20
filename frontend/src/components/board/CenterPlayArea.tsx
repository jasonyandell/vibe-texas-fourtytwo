import React from 'react'
import { DominoComponent } from '../DominoComponent'
import { SampleTrick } from './types'
import styles from '../GameBoardSection.module.css'

interface CenterPlayAreaProps {
  currentTrick: SampleTrick
  onPrevTrick: () => void
  onNextTrick: () => void
  currentTrickIndex: number
  totalTricks: number
}

export const CenterPlayArea: React.FC<CenterPlayAreaProps> = ({
  currentTrick,
  onPrevTrick,
  onNextTrick,
  currentTrickIndex,
  totalTricks
}) => {
  return (
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
            onClick={onPrevTrick}
            className={styles.trickButton}
            data-testid="prev-trick-button"
            aria-label="Show previous trick example"
          >
            ← Previous
          </button>
          <span className={styles.trickCounter}>
            {currentTrickIndex + 1} of {totalTricks}
          </span>
          <button 
            onClick={onNextTrick}
            className={styles.trickButton}
            data-testid="next-trick-button"
            aria-label="Show next trick example"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}