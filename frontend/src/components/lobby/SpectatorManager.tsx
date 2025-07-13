import React, { useState, useCallback } from 'react';
import { Button, Badge } from '@/components/ui';
import { SpectatorInfo } from './SpectatorView';
import styles from './SpectatorManager.module.css';

export interface SpectatorManagerProps {
  gameId: string;
  spectators: SpectatorInfo[];
  currentUserId?: string;
  isSpectating: boolean;
  canJoinAsSpectator: boolean;
  onJoinSpectating?: (gameId: string) => Promise<void>;
  onLeaveSpectating?: (gameId: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export const SpectatorManager: React.FC<SpectatorManagerProps> = ({
  gameId,
  spectators,
  currentUserId,
  isSpectating,
  canJoinAsSpectator,
  onJoinSpectating,
  onLeaveSpectating,
  onError
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSpectator = spectators.find(s => s.id === currentUserId);

  const handleJoinSpectating = useCallback(async () => {
    if (!onJoinSpectating || !canJoinAsSpectator) return;

    setIsJoining(true);
    setError(null);

    try {
      await onJoinSpectating(gameId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join as spectator';
      setError(errorMessage);
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsJoining(false);
    }
  }, [gameId, canJoinAsSpectator, onJoinSpectating, onError]);

  const handleLeaveSpectating = useCallback(async () => {
    if (!onLeaveSpectating) return;

    setIsLeaving(true);
    setError(null);

    try {
      await onLeaveSpectating(gameId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave spectating';
      setError(errorMessage);
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsLeaving(false);
    }
  }, [gameId, onLeaveSpectating, onError]);

  const getSpectatorButtonText = () => {
    if (isJoining) return 'Joining...';
    if (isLeaving) return 'Leaving...';
    if (isSpectating) return 'Stop Spectating';
    return 'Spectate Game';
  };

  const getSpectatorCount = () => {
    return spectators.length;
  };

  return (
    <div className={styles.spectatorManager}>
      <div className={styles.spectatorInfo}>
        <div className={styles.spectatorCount}>
          <Badge variant="secondary">
            {getSpectatorCount()} Spectator{getSpectatorCount() !== 1 ? 's' : ''}
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

      {error && (
        <div className={styles.errorMessage}>
          <Badge variant="danger">Error: {error}</Badge>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className={styles.spectatorActions}>
        {!isSpectating && canJoinAsSpectator && (
          <Button
            variant="ghost"
            onClick={handleJoinSpectating}
            disabled={isJoining}
            loading={isJoining}
            fullWidth
          >
            {getSpectatorButtonText()}
          </Button>
        )}

        {isSpectating && (
          <Button
            variant="secondary"
            onClick={handleLeaveSpectating}
            disabled={isLeaving}
            loading={isLeaving}
            fullWidth
          >
            {getSpectatorButtonText()}
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

      {spectators.length > 0 && (
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
      )}

      <div className={styles.spectatorHints}>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>👁️</span>
          <span>Spectators can view all player hands and game state</span>
        </div>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>🔄</span>
          <span>Seamlessly switch between spectating and playing</span>
        </div>
      </div>
    </div>
  );
};
