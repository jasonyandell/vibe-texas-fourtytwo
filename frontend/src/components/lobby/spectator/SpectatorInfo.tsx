import React from 'react';
import { Badge } from '@/components/ui';
import { SpectatorInfo as SpectatorInfoType } from '../SpectatorView';
import styles from '../SpectatorManager.module.css';

interface SpectatorInfoProps {
  spectators: SpectatorInfoType[];
  currentUserId?: string;
  isSpectating: boolean;
}

export const SpectatorInfo: React.FC<SpectatorInfoProps> = ({
  spectators,
  currentUserId,
  isSpectating
}) => {
  const currentSpectator = spectators.find(s => s.id === currentUserId);
  const spectatorCount = spectators.length;

  return (
    <div className={styles.spectatorInfo}>
      <div className={styles.spectatorCount}>
        <Badge variant="secondary">
          {spectatorCount} Spectator{spectatorCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      {isSpectating && currentSpectator && (
        <div className={styles.currentSpectatorInfo}>
          <Badge variant="primary" size="small">
            You are spectating
          </Badge>
          <span className={styles.joinTime}>
            Since {new Date(currentSpectator.joinedAt).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};