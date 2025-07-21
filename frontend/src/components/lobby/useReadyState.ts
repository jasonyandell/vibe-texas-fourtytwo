import { Player } from '@/types/texas42';

export const useReadyState = (
  players: (Player | null)[],
  currentUserId?: string
) => {
  const activePlayers = players.filter(p => p !== null);
  const readyPlayers = activePlayers.filter(p => p.isReady);
  const allPlayersReady = activePlayers.length === 4 && readyPlayers.length === 4;
  const currentPlayer = activePlayers.find(p => p.id === currentUserId);
  const isCurrentPlayerReady = currentPlayer?.isReady ?? false;

  return {
    activePlayers,
    readyPlayers,
    allPlayersReady,
    currentPlayer,
    isCurrentPlayerReady
  };
};