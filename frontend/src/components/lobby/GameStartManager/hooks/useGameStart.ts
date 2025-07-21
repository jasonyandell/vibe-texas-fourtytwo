import { useState, useCallback } from 'react';
import { GameState } from '@/types/texas42';

interface UseGameStartProps {
  gameId: string;
  canStartGame: boolean;
  onStartGame?: (gameId: string) => Promise<GameState>;
  onGameStarted?: (gameState: GameState) => void;
  onError?: (error: Error) => void;
}

export const useGameStart = ({
  gameId,
  canStartGame,
  onStartGame,
  onGameStarted,
  onError
}: UseGameStartProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

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

  return {
    isStarting,
    startError,
    setStartError,
    handleStartGame
  };
};