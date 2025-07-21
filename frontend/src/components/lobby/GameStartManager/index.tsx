import React from 'react';
import { Player, GameState } from '@/types/texas42';
import { Button, Badge } from '@/components/ui';
import { GameStatusSection } from './GameStatusSection';
import { StartProgressIndicator } from './StartProgressIndicator';
import { useGameStart } from './hooks/useGameStart';
import { getStartButtonText, calculateGameReadiness } from './utils/gameStartUtils';
import styles from '../GameStartManager.module.css';

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
  const { activePlayers, readyPlayers, canStartGame } = calculateGameReadiness(players);
  
  const {
    isStarting,
    startError,
    setStartError,
    handleStartGame
  } = useGameStart({
    gameId,
    canStartGame,
    onStartGame,
    onGameStarted,
    onError
  });

  const buttonText = getStartButtonText(isStarting, activePlayers, readyPlayers);

  return (
    <div className={styles.gameStartManager} data-testid="game-start-manager">
      <GameStatusSection players={players} />

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
          {buttonText}
        </Button>

        {canStartGame && !isStarting && (
          <div className={styles.startHint}>
            <p>All players are ready! Click to begin the game.</p>
          </div>
        )}
      </div>

      {isStarting && <StartProgressIndicator />}
    </div>
  );
};