import React from 'react';
import { Button, Badge } from '@/components/ui';
import styles from '../SpectatorManager.module.css';

interface SpectatorActionsProps {
  isSpectating: boolean;
  canJoinAsSpectator: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  buttonText: string;
  onJoin: () => void;
  onLeave: () => void;
}

export const SpectatorActions: React.FC<SpectatorActionsProps> = ({
  isSpectating,
  canJoinAsSpectator,
  isJoining,
  isLeaving,
  buttonText,
  onJoin,
  onLeave
}) => {
  return (
    <div className={styles.spectatorActions}>
      {!isSpectating && canJoinAsSpectator && (
        <Button
          variant="ghost"
          onClick={() => void onJoin()}
          disabled={isJoining}
          loading={isJoining}
          fullWidth
        >
          {buttonText}
        </Button>
      )}

      {isSpectating && (
        <Button
          variant="secondary"
          onClick={() => void onLeave()}
          disabled={isLeaving}
          loading={isLeaving}
          fullWidth
        >
          {buttonText}
        </Button>
      )}

      {!canJoinAsSpectator && !isSpectating && (
        <div className={styles.spectatorDisabled}>
          <Badge variant="secondary">
            Spectating not available
          </Badge>
        </div>
      )}
    </div>
  );
};