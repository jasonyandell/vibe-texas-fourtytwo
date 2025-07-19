import React, { useState } from 'react'
import { DominoComponent } from './DominoComponent'
import { createFullDominoSet, Domino } from '@/types/texas42'
import styles from './DominoesSection.module.css'

export const DominoesSection: React.FC = () => {
  const { dominoes, totalPoints, isValid } = createFullDominoSet()
  const [showPointValues, setShowPointValues] = useState(false)
  const [highlightCount, setHighlightCount] = useState(false)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [selectedDominoes, setSelectedDominoes] = useState<Set<string>>(new Set())
  const [selectionAnnouncement, setSelectionAnnouncement] = useState('')

  const countDominoes = dominoes.filter(d => d.isCountDomino)

  const handleDominoClick = (domino: Domino) => {
    const newSelected = new Set(selectedDominoes)
    if (newSelected.has(domino.id)) {
      newSelected.delete(domino.id)
      setSelectionAnnouncement(`Deselected domino ${domino.high}-${domino.low}`)
    } else {
      newSelected.add(domino.id)
      setSelectionAnnouncement(`Selected domino ${domino.high}-${domino.low}`)
    }
    setSelectedDominoes(newSelected)
  }

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
        <div className={styles.controls}>
          <button
            type="button"
            onClick={handleTogglePointValues}
            data-testid="toggle-point-values"
            className={`${styles.toggleButton} ${showPointValues ? styles.active : ''}`}
            aria-pressed={showPointValues}
          >
            {showPointValues ? 'Hide' : 'Show'} Point Values
          </button>

          <button
            type="button"
            onClick={handleToggleCountHighlighting}
            data-testid="toggle-count-highlighting"
            className={`${styles.toggleButton} ${highlightCount ? styles.active : ''}`}
            aria-pressed={highlightCount}
          >
            {highlightCount ? 'Hide' : 'Show'} Count Highlighting
          </button>

          <button
            type="button"
            onClick={handleToggleOrientation}
            data-testid="toggle-orientation"
            className={styles.toggleButton}
          >
            {orientation === 'horizontal' ? 'Vertical' : 'Horizontal'} View
          </button>
        </div>

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
