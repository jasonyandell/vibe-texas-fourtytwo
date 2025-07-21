import React from 'react'
import { DominoComponent } from '../DominoComponent'
import { SampleGameState } from './types'
import styles from '../GameBoardSection.module.css'

interface TrickStacksProps {
  gameState: SampleGameState
}

export const TrickStacks: React.FC<TrickStacksProps> = ({ gameState }) => {
  return (
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
              Tricks: {gameState.tricksWon.northSouth}
            </span>
            <span className={styles.stackPoints}>
              Points: {gameState.scores.northSouth}
            </span>
          </div>
          <div className={styles.trickStackDisplay}>
            {Array.from({ length: gameState.tricksWon.northSouth }, (_, i) => (
              <div
                key={`ns-trick-${i}`}
                className={styles.trickStackItem}
                data-testid={`trick-stack-item-ns-${i}`}
              >
                <div className={styles.stackedDominoes}>
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
              Tricks: {gameState.tricksWon.eastWest}
            </span>
            <span className={styles.stackPoints}>
              Points: {gameState.scores.eastWest}
            </span>
          </div>
          <div className={styles.trickStackDisplay}>
            {Array.from({ length: gameState.tricksWon.eastWest }, (_, i) => (
              <div
                key={`ew-trick-${i}`}
                className={styles.trickStackItem}
                data-testid={`trick-stack-item-ew-${i}`}
              >
                <div className={styles.stackedDominoes}>
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
  )
}