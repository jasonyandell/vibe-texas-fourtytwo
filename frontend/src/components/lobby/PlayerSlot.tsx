import React from 'react';
import { Badge } from '@/components/ui';
import { EmptySlotIcon } from './EmptySlotIcon';
import type { PlayerSlotProps } from './types';
import styles from './PlayerSlots.module.css';

export const PlayerSlot: React.FC<PlayerSlotProps> = ({
  player,
  index,
  position,
  currentUserId,
  gameStatus,
  onJoinSlot
}) => {
  const isCurrentUser = player?.id === currentUserId;
  const isEmpty = player === null;
  const canJoin = Boolean(isEmpty && gameStatus === 'waiting' && onJoinSlot);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (canJoin && onJoinSlot && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onJoinSlot(index);
    }
  };

  return (
    <div 
      className={`${styles.playerSlot} ${isEmpty ? styles.emptySlot : styles.occupiedSlot}`}
      data-position={position.toLowerCase()}
      data-current-user={isCurrentUser}
      onClick={canJoin && onJoinSlot ? () => onJoinSlot(index) : undefined}
      onKeyDown={canJoin ? handleKeyDown : undefined}
      role={canJoin ? 'button' : undefined}
      tabIndex={canJoin ? 0 : undefined}
      aria-label={canJoin ? `Join as ${position} player` : undefined}
    >
      <div className={styles.positionLabel}>
        {position}
      </div>
      
      {isEmpty ? (
        <EmptySlotContent canJoin={canJoin} />
      ) : (
        <PlayerInfo
          player={player}
          position={position}
          isCurrentUser={isCurrentUser}
          gameStatus={gameStatus}
        />
      )}
    </div>
  );
};

const EmptySlotContent: React.FC<{ canJoin: boolean }> = ({ canJoin }) => (
  <div className={styles.emptySlotContent}>
    <div className={styles.emptyIcon}>
      <EmptySlotIcon />
    </div>
    <span className={styles.emptyText}>
      {canJoin ? 'Click to join' : 'Empty slot'}
    </span>
  </div>
);

interface PlayerInfoProps {
  player: {
    name: string;
    isReady: boolean;
  };
  position: string;
  isCurrentUser: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  position,
  isCurrentUser,
  gameStatus
}) => (
  <div className={styles.playerInfo}>
    <div className={styles.playerAvatar}>
      {player.name.charAt(0).toUpperCase()}
    </div>
    <div className={styles.playerDetails}>
      <span 
        className={styles.playerName}
        data-testid={`player-name-${position.toLowerCase()}`}
      >
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
);