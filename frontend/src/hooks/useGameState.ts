import { useGameStateContext } from '@/hooks/useGameStateContext';

/**
 * Hook to access game state and actions
 * This is a convenience wrapper around the GameStateContext
 */
export const useGameState = () => {
  return useGameStateContext();
};
