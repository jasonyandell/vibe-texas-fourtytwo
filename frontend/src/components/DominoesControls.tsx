import React from 'react'
import styles from './DominoesSection.module.css'

interface DominoesControlsProps {
  showPointValues: boolean
  highlightCount: boolean
  orientation: 'horizontal' | 'vertical'
  onTogglePointValues: () => void
  onToggleCountHighlighting: () => void
  onToggleOrientation: () => void
}

export const DominoesControls: React.FC<DominoesControlsProps> = ({
  showPointValues,
  highlightCount,
  orientation,
  onTogglePointValues,
  onToggleCountHighlighting,
  onToggleOrientation
}) => {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        onClick={onTogglePointValues}
        data-testid="toggle-point-values"
        className={`${styles.toggleButton} ${showPointValues ? styles.active : ''}`}
        aria-pressed={showPointValues}
      >
        {showPointValues ? 'Hide' : 'Show'} Point Values
      </button>

      <button
        type="button"
        onClick={onToggleCountHighlighting}
        data-testid="toggle-count-highlighting"
        className={`${styles.toggleButton} ${highlightCount ? styles.active : ''}`}
        aria-pressed={highlightCount}
      >
        {highlightCount ? 'Hide' : 'Show'} Count Highlighting
      </button>

      <button
        type="button"
        onClick={onToggleOrientation}
        data-testid="toggle-orientation"
        className={styles.toggleButton}
      >
        {orientation === 'horizontal' ? 'Vertical' : 'Horizontal'} View
      </button>
    </div>
  )
}