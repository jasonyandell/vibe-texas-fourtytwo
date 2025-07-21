import React, { useState, useCallback } from 'react';
import { Button, Badge } from '@/components/ui';
import { Player } from '@/types/texas42';
import { useReadyCountdown } from './useReadyCountdown';
import { useReadyState } from './useReadyState';
import { PlayerReadyList } from './PlayerReadyList';
import styles from './ReadySystem.module.css';

export interface ReadySystemProps {
  players: (Player | null)[];
  currentUserId?: string;
  gameId: string;
  onMarkReady?: (gameId: string, playerId: string) => void;
  onUnmarkReady?: (gameId: string, playerId: string) => void;
  onStartGame?: (gameId: string) => Promise<void>;
  autoStartTimeout?: number; // seconds
}

export const ReadySystem: React.FC<ReadySystemProps> = ({
  players,
  currentUserId,
  gameId,
  onMarkReady,
  onUnmarkReady,
  onStartGame,
  autoStartTimeout = 10
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const {
    activePlayers,
    readyPlayers,
    allPlayersReady,
    isCurrentPlayerReady
  } = useReadyState(players, currentUserId);

  const handleAutoStart = useCallback(async () => {
    if (onStartGame && allPlayersReady) {
      setIsStarting(true);
      try {
        await onStartGame(gameId);
        setIsStarting(false);
      } catch (error) {
        console.error('Failed to start game:', error);
        setIsStarting(false);
      }
    }
  }, [onStartGame, allPlayersReady, gameId]);

  const { countdown, cancelCountdown } = useReadyCountdown({
    allPlayersReady,
    autoStartTimeout,
    isStarting,
    onAutoStart: handleAutoStart
  });

  const handleToggleReady = () => {
    if (!currentUserId) return;

    if (isCurrentPlayerReady && onUnmarkReady) {
      onUnmarkReady(gameId, currentUserId);
    } else if (!isCurrentPlayerReady && onMarkReady) {
      onMarkReady(gameId, currentUserId);
    }
  };

  const handleManualStart = () => {
    if (onStartGame && allPlayersReady) {
      cancelCountdown();
      void handleAutoStart();
    }
  };

  if (activePlayers.length < 4) {
    return (
      <div className={styles.readySystem}>
        <div className={styles.waitingMessage}>
          <Badge variant="warning">
            Waiting for {4 - activePlayers.length} more player{4 - activePlayers.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.readySystem}>
      <div className={styles.readyStatus}>
        <div className={styles.statusHeader}>
          <h4>Ready Status</h4>
          <Badge variant={allPlayersReady ? 'success' : 'warning'}>
            {readyPlayers.length}/4 Ready
          </Badge>
        </div>

        <PlayerReadyList players={activePlayers} currentUserId={currentUserId} />
      </div>

      <div className={styles.readyActions}>
        {currentUserId && (
          <Button
            variant={isCurrentPlayerReady ? 'secondary' : 'primary'}
            onClick={handleToggleReady}
            disabled={isStarting}
            fullWidth
            aria-label={isCurrentPlayerReady ? 'Mark yourself as not ready' : 'Mark yourself as ready to start the game'}
          >
            {isCurrentPlayerReady ? 'Not Ready' : 'Ready Up!'}
          </Button>
        )}

        {allPlayersReady && (
          <div className={styles.startSection}>
            {countdown !== null && (
              <div className={styles.countdown}>
                <Badge variant="success" size="large">
                  Starting in {countdown}s
                </Badge>
              </div>
            )}
            
            <Button
              variant="primary"
              onClick={handleManualStart}
              disabled={isStarting}
              loading={isStarting}
              fullWidth
            >
              {isStarting ? 'Starting Game...' : 'Start Game Now'}
            </Button>
          </div>
        )}
      </div>

      {allPlayersReady && countdown !== null && (
        <div className={styles.cancelCountdown}>
          <Button
            variant="ghost"
            size="small"
            onClick={cancelCountdown}
            disabled={isStarting}
          >
            Cancel Auto-Start
          </Button>
        </div>
      )}
    </div>
  );
};