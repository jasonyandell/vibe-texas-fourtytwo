import { useCallback } from 'react';
import { GameState } from '@texas42/shared-types';

interface GameStateActions {
  updateGameState: (gameState: GameState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export function useRetryOperation({ updateGameState, setError, setLoading }: GameStateActions) {
  const retryOperation = useCallback(async (operation: () => Promise<GameState>) => {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        setLoading(true);
        const result = await operation();
        updateGameState(result);
        setLoading(false);
        return;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          setError(error as Error);
          setLoading(false);
          throw error;
        }
        // For testing, we'll retry immediately. In production, add delay here.
        if (process.env.NODE_ENV !== 'test') {
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }, [updateGameState, setError, setLoading]);

  return retryOperation;
}