import React, { useState } from 'react'
import { PlayerPosition } from '@/types/texas42'
import { PlayerCard } from './PlayerCard'
import { PlayerControls } from './PlayerControls'
import { createSamplePlayers } from '@/utils/samplePlayerData'
import { Partnership, getPartnership, getPartnershipName } from '@/utils/partnershipUtils'
import styles from './PlayersSection.module.css'

export const PlayersSection: React.FC = () => {
  const [players] = useState(createSamplePlayers())
  const [dealer, setDealer] = useState<string>('player-1')
  const [currentPlayer] = useState<string>('player-2')
  const [highlightedPartnership, setHighlightedPartnership] = useState<Partnership | null>(null)
  const [showHands, setShowHands] = useState(false)
  const [faceDown, setFaceDown] = useState(false)
  const [partnershipAnnouncement, setPartnershipAnnouncement] = useState('')

  const getPlayerByPosition = (position: PlayerPosition) => {
    return players.find(player => player.position === position)
  }

  const handlePlayerClick = (position: PlayerPosition) => {
    const partnership = getPartnership(position)
    
    if (highlightedPartnership === partnership) {
      setHighlightedPartnership(null)
      setPartnershipAnnouncement('Partnership highlighting cleared')
    } else {
      setHighlightedPartnership(partnership)
      const partnershipName = getPartnershipName(partnership)
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

  const renderPlayerCard = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position)
    if (!player) return null

    const partnership = getPartnership(position)
    const isHighlighted = highlightedPartnership === partnership

    return (
      <PlayerCard
        key={position}
        player={player}
        position={position}
        partnership={partnership}
        isDealer={dealer === player.id}
        isCurrentPlayer={currentPlayer === player.id}
        isHighlighted={isHighlighted}
        showHands={showHands}
        faceDown={faceDown}
        onClick={() => handlePlayerClick(position)}
        onKeyDown={(e) => handleKeyDown(e, position)}
      />
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

      <PlayerControls
        showHands={showHands}
        faceDown={faceDown}
        onShowHandsChange={setShowHands}
        onFaceDownChange={setFaceDown}
        onRotateDealer={rotateDealer}
      />

      <div className={styles.content}>
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