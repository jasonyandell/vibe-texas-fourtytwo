import React from 'react';
import { Badge } from '@/components/ui';
import { SpectatorInfo } from '../SpectatorView';
import styles from '../SpectatorManager.module.css';

interface SpectatorListProps {
  spectators: SpectatorInfo[];
  currentUserId?: string;
}

export const SpectatorList: React.FC<SpectatorListProps> = ({
  spectators,
  currentUserId
}) => {
  if (spectators.length === 0) {
    return null;
  }

  return (
    <div className={styles.spectatorList}>
      <div className={styles.spectatorListHeader}>
        <h5>Current Spectators</h5>
      </div>
      
      <div className={styles.spectatorItems}>
        {spectators.map(spectator => (
          <div 
            key={spectator.id}
            className={`${styles.spectatorItem} ${spectator.id === currentUserId ? styles.currentUser : ''}`}
          >
            <span className={styles.spectatorName}>
              {spectator.name}
              {spectator.id === currentUserId && (
                <Badge variant="primary" size="small">You</Badge>
              )}
            </span>
            <span className={styles.spectatorJoinTime}>
              {new Date(spectator.joinedAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};