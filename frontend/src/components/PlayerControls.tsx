import React from 'react'
import styles from './PlayersSection.module.css'

interface PlayerControlsProps {
  showHands: boolean
  faceDown: boolean
  onShowHandsChange: (checked: boolean) => void
  onFaceDownChange: (checked: boolean) => void
  onRotateDealer: () => void
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  showHands,
  faceDown,
  onShowHandsChange,
  onFaceDownChange,
  onRotateDealer
}) => {
  return (
    <div className={styles.topControls} aria-label="Player interaction controls">
      <div className={styles.controlsRow}>
        <div className={styles.controlGroup}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showHands}
              onChange={(e) => onShowHandsChange(e.target.checked)}
              data-testid="toggle-hand-visibility"
            />
            <span>Show Player Hands</span>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={faceDown}
              onChange={(e) => onFaceDownChange(e.target.checked)}
              disabled={!showHands}
              data-testid="toggle-face-down"
            />
            <span>Face Down</span>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <button
            onClick={onRotateDealer}
            className={styles.actionButton}
            data-testid="toggle-dealer-rotation"
          >
            Rotate Dealer
          </button>
        </div>

        <div className={styles.partnershipLegend}>
          <h5>Partnerships</h5>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div className={`${styles.colorIndicator} ${styles.northSouthColor}`}></div>
              <span>North-South</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.colorIndicator} ${styles.eastWestColor}`}></div>
              <span>East-West</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}