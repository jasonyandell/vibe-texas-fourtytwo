import { useContext } from 'react';
import { GameStateContext } from '@/contexts/GameStateContext';

// Hook to use the context
export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};
