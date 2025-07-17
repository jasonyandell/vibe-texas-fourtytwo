import React, { useState } from 'react'
import { PlayerPosition, Player, Domino } from '@/types/texas42'
import { DominoHand } from './DominoHand'
import { createFullDominoSet } from '@/types/texas42'
import styles from './PlayersSection.module.css'

// Sample player data for the demo
const createSamplePlayers = (): Player[] => {
  const { dominoes } = createFullDominoSet()
  
  // Create sample hands (7 dominoes each)
  const hands = [
    dominoes.slice(0, 7),   // Alice (North)
    dominoes.slice(7, 14),  // Bob (East)
    dominoes.slice(14, 21), // Charlie (South)
    dominoes.slice(21, 28)  // Diana (West)
  ]

  return [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: hands[0],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: hands[1],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'Charlie',
      position: 'south',
      hand: hands[2],
      isConnected: true,
      isReady: false
    },
    {
      id: 'player-4',
      name: 'Diana',
      position: 'west',
      hand: hands[3],
      isConnected: true,
      isReady: true
    }
  ]
}

type Partnership = 'north-south' | 'east-west'

export const PlayersSection: React.FC = () => {
  const [players] = useState<Player[]>(createSamplePlayers())
  const [dealer, setDealer] = useState<string>('player-1') // Alice starts as dealer
  const [currentPlayer] = useState<string>('player-2') // Bob's turn
  const [highlightedPartnership, setHighlightedPartnership] = useState<Partnership | null>(null)
  const [showHands, setShowHands] = useState(false)
  const [faceDown, setFaceDown] = useState(false)
  const [partnershipAnnouncement, setPartnershipAnnouncement] = useState('')

  const getPartnership = (position: PlayerPosition): Partnership => {
    return position === 'north' || position === 'south' ? 'north-south' : 'east-west'
  }

  const getPlayerByPosition = (position: PlayerPosition): Player | undefined => {
    return players.find(player => player.position === position)
  }

  const isDealer = (playerId: string): boolean => {
    return dealer === playerId
  }

  const isCurrentPlayer = (playerId: string): boolean => {
    return currentPlayer === playerId
  }

  const handlePlayerClick = (position: PlayerPosition) => {
    const partnership = getPartnership(position)
    
    if (highlightedPartnership === partnership) {
      // Toggle off if same partnership clicked
      setHighlightedPartnership(null)
      setPartnershipAnnouncement('Partnership highlighting cleared')
    } else {
      // Highlight new partnership
      setHighlightedPartnership(partnership)
      const partnershipName = partnership === 'north-south' ? 'North-South' : 'East-West'
      setPartnershipAnnouncement(`${partnershipName} partnership highlighted`)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, position: PlayerPosition) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePlayerClick(position)
    }
  }

  const rotateDealer = () => {
    const positions: PlayerPosition[] = ['north', 'east', 'south', 'west']
    const currentDealerPlayer = players.find(p => p.id === dealer)
    if (!currentDealerPlayer) return

    const currentIndex = positions.indexOf(currentDealerPlayer.position)
    const nextIndex = (currentIndex + 1) % 4
    const nextPosition = positions[nextIndex]
    const nextPlayer = getPlayerByPosition(nextPosition)
    
    if (nextPlayer) {
      setDealer(nextPlayer.id)
    }
  }

  const getPlayerCardClasses = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position)
    const partnership = getPartnership(position)
    const isHighlighted = highlightedPartnership === partnership

    return [
      styles.playerCard,
      styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`],
      styles[partnership === 'north-south' ? 'partnershipNorthSouth' : 'partnershipEastWest'],
      isHighlighted ? styles.partnershipHighlighted : '',
      player && isDealer(player.id) ? styles.dealer : '',
      player && isCurrentPlayer(player.id) ? styles.currentPlayer : ''
    ].filter(Boolean).join(' ')
  }

  const renderPlayerCard = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position)
    const partnership = getPartnership(position)

    if (!player) return null

    return (
      <div
        key={position}
        className={getPlayerCardClasses(position)}
        data-testid={`player-card-${position}`}
        data-partnership={partnership}
        onClick={() => handlePlayerClick(position)}
        onKeyDown={(e) => handleKeyDown(e, position)}
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
            {isDealer(player.id) && <span className={styles.dealerBadge}>Dealer</span>}
            {player.isReady && <span className={styles.readyBadge}>Ready</span>}
            {isCurrentPlayer(player.id) && <span className={styles.currentTurnBadge}>Current Turn</span>}
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
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className={`${styles.playersSection} ${styles.responsive}`}
      data-testid="players-section-container"
      aria-label="Baseball diamond player layout"
    >
      <div className={styles.header}>
        <h3>Baseball Diamond Layout</h3>
        <p>4-player positioning with North-South vs East-West partnerships. Click any player to highlight their partnership.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.controls} aria-label="Player interaction controls">
          <h4>Interactive Controls</h4>
          
          <div className={styles.controlGroup}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showHands}
                onChange={(e) => setShowHands(e.target.checked)}
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
                onChange={(e) => setFaceDown(e.target.checked)}
                disabled={!showHands}
                data-testid="toggle-face-down"
              />
              <span>Face Down</span>
            </label>
          </div>

          <div className={styles.controlGroup}>
            <button
              onClick={rotateDealer}
              className={styles.actionButton}
              data-testid="toggle-dealer-rotation"
            >
              Rotate Dealer
            </button>
          </div>

          <div className={styles.partnershipLegend}>
            <h5>Partnerships</h5>
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

        <div 
          className={`${styles.playersDiamond} ${styles.baseballDiamond} ${styles.mobileFriendly}`}
          data-testid="players-diamond"
          role="region"
          aria-label="Player positions in diamond formation"
        >
          {renderPlayerCard('north')}
          {renderPlayerCard('east')}
          {renderPlayerCard('south')}
          {renderPlayerCard('west')}
        </div>
      </div>

      <div
        data-testid="partnership-announcer"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {partnershipAnnouncement}
      </div>
    </div>
  )
}
