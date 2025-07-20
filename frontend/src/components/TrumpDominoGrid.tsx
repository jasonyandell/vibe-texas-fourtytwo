import React from 'react'
import { DominoComponent } from './DominoComponent'
import { createFullDominoSet, DominoSuit } from '@/types/texas42'
import { trumpSuits, isTrumpDomino } from '@/utils/trumpUtils'
import styles from './BiddingSection.module.css'

interface TrumpDominoGridProps {
  selectedTrumpSuit: DominoSuit | null
}

export const TrumpDominoGrid: React.FC<TrumpDominoGridProps> = ({ selectedTrumpSuit }) => {
  const { dominoes } = createFullDominoSet()

  return (
    <div className={styles.dominoGridSection}>
      <h4>
        Domino Set
        {selectedTrumpSuit && (
          <span className={styles.trumpIndicator}>
            - {trumpSuits.find(t => t.suit === selectedTrumpSuit)?.label} Trump Highlighted
          </span>
        )}
      </h4>
      <div
        className={styles.dominoesGrid}
        data-testid="dominoes-grid-with-trump"
        role="grid"
        aria-label={selectedTrumpSuit
          ? `Domino set with ${selectedTrumpSuit} trump highlighted`
          : "Complete domino set"
        }
      >
        {dominoes.map((domino) => {
          const isTrump = selectedTrumpSuit ? isTrumpDomino(domino, selectedTrumpSuit) : false
          return (
            <DominoComponent
              key={domino.id}
              domino={domino}
              onClick={() => {}}
              orientation="horizontal"
              selected={false}
              showPointValue={false}
              highlightCount={false}
              className={`${styles.gridDomino} ${isTrump ? styles.trumpHighlight : ''}`}
              isPlayable={false}
            />
          )
        })}
      </div>
    </div>
  )
}