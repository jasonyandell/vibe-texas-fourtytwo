import React from 'react'
import { PlayerPosition, Player } from '@/types/texas42'
import { DominoHand } from './DominoHand'
import styles from './PlayersSection.module.css'

interface PlayerCardProps {
  player: Player
  position: PlayerPosition
  partnership: 'north-south' | 'east-west'
  isDealer: boolean
  isCurrentPlayer: boolean
  isHighlighted: boolean
  showHands: boolean
  faceDown: boolean
  onClick: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  position,
  partnership,
  isDealer,
  isCurrentPlayer,
  isHighlighted,
  showHands,
  faceDown,
  onClick,
  onKeyDown
}) => {
  const getPlayerCardClasses = () => {
    return [
      styles.playerCard,
      styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`],
      styles[partnership === 'north-south' ? 'partnershipNorthSouth' : 'partnershipEastWest'],
      isHighlighted ? styles.partnershipHighlighted : '',
      isDealer ? styles.dealer : '',
      isCurrentPlayer ? styles.currentPlayer : ''
    ].filter(Boolean).join(' ')
  }

  return (
    <div
      className={getPlayerCardClasses()}
      data-testid={`player-card-${position}`}
      data-partnership={partnership}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${player.name}, ${position} position, ${partnership} partnership`}
    >
      <div className={styles.playerInfo}>
        <div className={styles.playerHeader}>
          <span className={styles.playerName}>{player.name}</span>
          <span className={styles.positionLabel}>{position.charAt(0).toUpperCase() + position.slice(1)}</span>
        </div>
        
        <div className={styles.playerStatus}>
          {isDealer && <span className={styles.dealerBadge}>Dealer</span>}
          {player.isReady && <span className={styles.readyBadge}>Ready</span>}
          {isCurrentPlayer && <span className={styles.currentTurnBadge}>Current Turn</span>}
        </div>
      </div>

      {showHands && (
        <div
          className={`${styles.playerHandContainer} ${faceDown ? styles.faceDown : ''}`}
          data-testid={`domino-hand-${position}`}
        >
          <DominoHand
            dominoes={player.hand}
            faceDown={faceDown}
            orientation="horizontal"
            className={styles.playerHand}
            compact={true}
          />
        </div>
      )}
    </div>
  )
}