import React, { useState, useCallback } from 'react';
import { Player, GameState } from '@/types/texas42';
import { Button, Badge } from '@/components/ui';
import styles from './GameStartManager.module.css';

export interface GameStartManagerProps {
  gameId: string;
  players: (Player | null)[];
  onStartGame?: (gameId: string) => Promise<GameState>;
  onGameStarted?: (gameState: GameState) => void;
  onError?: (error: Error) => void;
}

export const GameStartManager: React.FC<GameStartManagerProps> = ({
  gameId,
  players,
  onStartGame,
  onGameStarted,
  onError
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Calculate game start readiness
  const activePlayers = players.filter(p => p !== null);
  const readyPlayers = activePlayers.filter(p => p.isReady);
  const canStartGame = activePlayers.length === 4 && readyPlayers.length === 4;

  const handleStartGame = useCallback(async () => {
    if (!canStartGame || !onStartGame) {
      return;
    }

    setIsStarting(true);
    setStartError(null);

    try {
      const gameState = await onStartGame(gameId);
      
      if (onGameStarted) {
        onGameStarted(gameState);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start game';
      setStartError(errorMessage);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setIsStarting(false);
    }
  }, [gameId, canStartGame, onStartGame, onGameStarted, onError]);

  const getStartButtonText = () => {
    if (isStarting) return 'Starting Game...';
    if (activePlayers.length < 4) return `Need ${4 - activePlayers.length} More Players`;
    if (readyPlayers.length < 4) return `Waiting for ${4 - readyPlayers.length} Players`;
    return 'Start Game';
  };

  const getStatusBadge = () => {
    if (activePlayers.length < 4) {
      return (
        <Badge variant="warning">
          {activePlayers.length}/4 Players
        </Badge>
      );
    }

    if (readyPlayers.length < 4) {
      return (
        <Badge variant="warning">
          {readyPlayers.length}/4 Ready
        </Badge>
      );
    }

    return (
      <Badge variant="success">
        All Players Ready!
      </Badge>
    );
  };

  return (
    <div className={styles.gameStartManager} data-testid="game-start-manager">
      <div className={styles.statusSection} data-testid="status-section">
        <div className={styles.statusHeader}>
          <h4>Game Status</h4>
          {getStatusBadge()}
        </div>

        {activePlayers.length === 4 && (
          <div className={styles.readyBreakdown}>
            <div className={styles.readyGrid} data-testid="ready-grid">
              {activePlayers.map(player => (
                <div 
                  key={player.id}
                  className={`${styles.playerStatus} ${player.isReady ? styles.ready : styles.notReady}`}
                  data-testid={`player-status-${player.id}`}
                >
                  <span className={styles.playerName}>{player.name}</span>
                  <span className={styles.readyIndicator}>
                    {player.isReady ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {startError && (
        <div className={styles.errorMessage}>
          <Badge variant="danger">Error: {startError}</Badge>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setStartError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className={styles.actionSection} data-testid="action-section">
        <Button
          variant="primary"
          size="large"
          onClick={() => void handleStartGame()}
          disabled={!canStartGame || isStarting}
          loading={isStarting}
          fullWidth
        >
          {getStartButtonText()}
        </Button>

        {canStartGame && !isStarting && (
          <div className={styles.startHint}>
            <p>All players are ready! Click to begin the game.</p>
          </div>
        )}
      </div>

      {isStarting && (
        <div className={styles.startingProgress}>
          <div className={styles.progressSteps}>
            <div className={styles.progressStep}>
              <span className={styles.stepIcon}>⚙️</span>
              <span>Initializing game...</span>
            </div>
            <div className={styles.progressStep}>
              <span className={styles.stepIcon}>🎲</span>
              <span>Shuffling dominoes...</span>
            </div>
            <div className={styles.progressStep}>
              <span className={styles.stepIcon}>🃏</span>
              <span>Dealing hands...</span>
            </div>
            <div className={styles.progressStep}>
              <span className={styles.stepIcon}>🎯</span>
              <span>Starting bidding...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
