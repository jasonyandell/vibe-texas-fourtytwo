import { useLobbyStateContext } from '@/contexts/LobbyStateContext';

/**
 * Hook to access lobby state and actions
 * This is a convenience wrapper around the LobbyStateContext
 */
export const useLobbyState = () => {
  return useLobbyStateContext();
};
