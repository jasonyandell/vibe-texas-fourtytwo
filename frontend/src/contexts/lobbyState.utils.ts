import { LobbyGame } from '@/types/texas42';

// Game filtering utilities
export const filterGamesByStatus = (games: LobbyGame[], status?: LobbyGame['status']): LobbyGame[] => {
  if (!status) return games;
  return games.filter(game => game.status === status);
};

export const filterJoinableGames = (games: LobbyGame[]): LobbyGame[] => {
  return games.filter(
    game => game.status === 'waiting' && game.playerCount < game.maxPlayers
  );
};

// Game sorting utilities
export const sortGames = (games: LobbyGame[], sortBy: 'newest' | 'oldest' | 'playerCount' | 'name'): LobbyGame[] => {
  const sortedGames = [...games];
  
  switch (sortBy) {
    case 'newest':
      return sortedGames.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sortedGames.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'playerCount':
      return sortedGames.sort((a, b) => b.playerCount - a.playerCount);
    case 'name':
      return sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sortedGames;
  }
};