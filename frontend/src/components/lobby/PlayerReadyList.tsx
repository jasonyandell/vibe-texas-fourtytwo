import React from 'react';
import { Badge } from '@/components/ui';
import { Player } from '@/types/texas42';
import styles from './ReadySystem.module.css';

interface PlayerReadyListProps {
  players: Player[];
  currentUserId?: string;
}

export const PlayerReadyList: React.FC<PlayerReadyListProps> = ({
  players,
  currentUserId
}) => {
  return (
    <div className={styles.playerReadyList}>
      {players.map(player => (
        <div 
          key={player.id} 
          className={`${styles.playerReadyItem} ${player.isReady ? styles.ready : styles.notReady}`}
        >
          <span className={styles.playerName}>
            {player.name}
            {player.id === currentUserId && (
              <Badge variant="primary" size="small" className={styles.youBadge}>
                You
              </Badge>
            )}
          </span>
          <Badge 
            variant={player.isReady ? 'success' : 'secondary'} 
            size="small"
          >
            {player.isReady ? 'Ready' : 'Not Ready'}
          </Badge>
        </div>
      ))}
    </div>
  );
};