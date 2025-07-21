import React, { useState } from 'react'
import { DominoComponent } from './DominoComponent'
import { DominoesControls } from './DominoesControls'
import { useDominoSelection } from './hooks/useDominoSelection'
import { createFullDominoSet } from '@/types/texas42'
import styles from './DominoesSection.module.css'

export const DominoesSection: React.FC = () => {
  const { dominoes } = createFullDominoSet()
  const [showPointValues, setShowPointValues] = useState(false)
  const [highlightCount, setHighlightCount] = useState(false)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const { selectedDominoes, selectionAnnouncement, handleDominoClick } = useDominoSelection()

  const handleTogglePointValues = () => {
    setShowPointValues(!showPointValues)
  }

  const handleToggleCountHighlighting = () => {
    setHighlightCount(!highlightCount)
  }

  const handleToggleOrientation = () => {
    setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')
  }

  return (
    <div 
      className={styles.dominoesSection}
      data-testid="dominoes-section-container"
      aria-label="Complete domino set showcase"
    >
      <div className={styles.header}>
        <h3>Complete Domino Set</h3>
        <p>All 28 dominoes from the double-6 set with interactive features for exploring point values and visual properties.</p>
      </div>

      <div className={styles.mainContent}>
        <DominoesControls
          showPointValues={showPointValues}
          highlightCount={highlightCount}
          orientation={orientation}
          onTogglePointValues={handleTogglePointValues}
          onToggleCountHighlighting={handleToggleCountHighlighting}
          onToggleOrientation={handleToggleOrientation}
        />

        <div
          className={styles.dominoesGrid}
          data-testid="dominoes-grid"
          role="grid"
          aria-label="All 28 dominoes from double-6 set"
        >
          {dominoes.map((domino) => (
            <DominoComponent
              key={domino.id}
              domino={domino}
              onClick={() => handleDominoClick(domino)}
              orientation={orientation}
              selected={selectedDominoes.has(domino.id)}
              showPointValue={showPointValues}
              highlightCount={highlightCount}
              className={`${styles.gridDomino} ${orientation} ${selectedDominoes.has(domino.id) ? 'selected' : ''} ${highlightCount && domino.isCountDomino ? 'highlighted' : ''}`}
              isPlayable={true}
            />
          ))}
        </div>
      </div>

      <div
        data-testid="selection-announcer"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {selectionAnnouncement}
      </div>
    </div>
  )
}