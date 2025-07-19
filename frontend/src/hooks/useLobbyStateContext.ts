import { useContext } from 'react';
import { LobbyStateContext } from '@/contexts/LobbyStateContext';

// Hook to use the context
export const useLobbyStateContext = () => {
  const context = useContext(LobbyStateContext);
  if (context === undefined) {
    throw new Error('useLobbyStateContext must be used within a LobbyStateProvider');
  }
  return context;
};
