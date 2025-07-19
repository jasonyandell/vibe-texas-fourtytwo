import React from 'react';
import { Badge } from '@/components/ui';
import styles from './PlayerSlots.module.css';

export interface Player {
  id: string;
  name: string;
  position: 'north' | 'east' | 'south' | 'west';
  isReady: boolean;
}

export interface PlayerSlotsProps {
  players: (Player | null)[];
  currentUserId?: string;
  gameStatus: 'waiting' | 'playing' | 'finished';
  onJoinSlot?: (position: number) => void;
}

export const PlayerSlots: React.FC<PlayerSlotsProps> = ({
  players,
  currentUserId,
  gameStatus,
  onJoinSlot
}) => {
  const positions = ['North', 'East', 'South', 'West'];
  const partnerships = [
    { team: 'North-South', positions: [0, 2] },
    { team: 'East-West', positions: [1, 3] }
  ];

  const renderPlayerSlot = (player: Player | null, index: number) => {
    const isCurrentUser = player?.id === currentUserId;
    const isEmpty = player === null;
    const canJoin = isEmpty && gameStatus === 'waiting' && onJoinSlot;

    return (
      <div 
        key={index}
        className={`${styles.playerSlot} ${isEmpty ? styles.emptySlot : styles.occupiedSlot}`}
        data-position={positions[index].toLowerCase()}
        data-current-user={isCurrentUser}
        onClick={canJoin ? () => onJoinSlot(index) : undefined}
        role={canJoin ? 'button' : undefined}
        tabIndex={canJoin ? 0 : undefined}
        aria-label={canJoin ? `Join as ${positions[index]} player` : undefined}
      >
        <div className={styles.positionLabel}>
          {positions[index]}
        </div>
        
        {isEmpty ? (
          <div className={styles.emptySlotContent}>
            <div className={styles.emptyIcon}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <span className={styles.emptyText}>
              {canJoin ? 'Click to join' : 'Empty slot'}
            </span>
          </div>
        ) : (
          <div className={styles.playerInfo}>
            <div className={styles.playerAvatar}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.playerDetails}>
              <span className={styles.playerName}>
                {player.name}
                {isCurrentUser && (
                  <Badge variant="primary" size="small" className={styles.youBadge}>
                    You
                  </Badge>
                )}
              </span>
              {gameStatus === 'waiting' && (
                <div className={styles.readyStatus}>
                  <Badge 
                    variant={player.isReady ? 'success' : 'warning'} 
                    size="small"
                  >
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.playerSlots}>
      <div className={styles.slotsHeader}>
        <h4>Players</h4>
        <div className={styles.partnerships}>
          {partnerships.map((partnership, index) => (
            <div key={index} className={styles.partnership}>
              <span className={styles.teamName}>{partnership.team}</span>
              <div className={styles.teamMembers}>
                {partnership.positions.map(pos => {
                  const player = players[pos];
                  return (
                    <span key={pos} className={styles.teamMember}>
                      {player ? player.name : 'Empty'}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.slotsGrid}>
        {players.map((player, index) => renderPlayerSlot(player, index))}
      </div>
    </div>
  );
};
