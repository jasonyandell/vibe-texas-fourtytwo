import { Player } from '@/types/texas42';

export const getStartButtonText = (
  isStarting: boolean,
  activePlayers: Player[],
  readyPlayers: Player[]
): string => {
  if (isStarting) return 'Starting Game...';
  if (activePlayers.length < 4) return `Need ${4 - activePlayers.length} More Players`;
  if (readyPlayers.length < 4) return `Waiting for ${4 - readyPlayers.length} Players`;
  return 'Start Game';
};

export const calculateGameReadiness = (players: (Player | null)[]) => {
  const activePlayers = players.filter(p => p !== null);
  const readyPlayers = activePlayers.filter(p => p.isReady);
  const canStartGame = activePlayers.length === 4 && readyPlayers.length === 4;

  return {
    activePlayers,
    readyPlayers,
    canStartGame
  };
};