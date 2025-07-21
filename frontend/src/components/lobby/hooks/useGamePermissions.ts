import { useMemo } from 'react';
import { LobbyGame } from '@/types/texas42';

interface GamePermissions {
  isUserInGame: boolean;
  canJoin: boolean;
  canSpectate: boolean;
  canMarkReady: boolean;
  allPlayersReady: boolean;
}

interface Player {
  id: string;
  name: string;
  position: 'north' | 'south' | 'east' | 'west';
  isReady: boolean;
}

export function useGamePermissions(
  game: LobbyGame,
  currentUserId?: string,
  players: (Player | null)[] = []
): GamePermissions {
  return useMemo(() => {
    const isUserInGame = currentUserId ? players.some(player => player?.id === currentUserId) : false;
    const canJoin = game.status === 'waiting' && game.playerCount < game.maxPlayers && !isUserInGame;
    const canSpectate = game.status === 'playing';
    const allPlayersReady = players.filter(p => p !== null).every(p => p?.isReady);
    const canMarkReady = isUserInGame && game.status === 'waiting' && game.playerCount === 4;

    return {
      isUserInGame,
      canJoin,
      canSpectate,
      canMarkReady,
      allPlayersReady
    };
  }, [game, currentUserId, players]);
}