import React, { useState, useEffect, useCallback } from 'react';
import { Button, Badge } from '@/components/ui';
import { Player } from '@/types/texas42';
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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Calculate ready state
  const activePlayers = players.filter(p => p !== null);
  const readyPlayers = activePlayers.filter(p => p.isReady);
  const allPlayersReady = activePlayers.length === 4 && readyPlayers.length === 4;
  const currentPlayer = activePlayers.find(p => p.id === currentUserId);
  const isCurrentPlayerReady = currentPlayer?.isReady ?? false;

  const handleAutoStart = useCallback(async () => {
    if (onStartGame && allPlayersReady) {
      setIsStarting(true);
      try {
        await onStartGame(gameId);
        // Game start is handled by parent component
        setIsStarting(false);
      } catch (error) {
        console.error('Failed to start game:', error);
        setIsStarting(false);
      }
    }
  }, [onStartGame, allPlayersReady, gameId]);

  // Auto-start countdown when all players are ready
  useEffect(() => {
    if (allPlayersReady && !isStarting) {
      setCountdown(autoStartTimeout);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            void handleAutoStart();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [allPlayersReady, autoStartTimeout, isStarting, handleAutoStart]);

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
      setCountdown(null);
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

        <div className={styles.playerReadyList}>
          {activePlayers.map(player => (
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
            onClick={() => setCountdown(null)}
            disabled={isStarting}
          >
            Cancel Auto-Start
          </Button>
        </div>
      )}
    </div>
  );
};
