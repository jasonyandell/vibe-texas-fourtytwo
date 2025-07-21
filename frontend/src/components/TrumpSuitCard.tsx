import React from 'react'
import { DominoSuit } from '@/types/texas42'
import styles from './BiddingSection.module.css'

export interface TrumpSuitInfo {
  suit: DominoSuit
  label: string
  description: string
  dominoCount: number
}

interface TrumpSuitCardProps {
  trumpInfo: TrumpSuitInfo
  isSelected: boolean
  onClick: () => void
}

export const TrumpSuitCard: React.FC<TrumpSuitCardProps> = ({ trumpInfo, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`${styles.trumpSuitCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      data-testid={`trump-suit-${trumpInfo.suit}`}
      aria-pressed={isSelected}
      aria-describedby={`trump-desc-${trumpInfo.suit}`}
    >
      <div className={styles.trumpSuitLabel}>{trumpInfo.label}</div>
      <div
        id={`trump-desc-${trumpInfo.suit}`}
        className={styles.trumpSuitDescription}
      >
        {trumpInfo.description}
      </div>
      <div className={styles.trumpSuitCount}>
        {trumpInfo.dominoCount} dominoes
      </div>
    </button>
  )
}