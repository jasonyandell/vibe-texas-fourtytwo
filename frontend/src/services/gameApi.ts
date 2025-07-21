import { LobbyGame } from '@/types/texas42';

const getApiUrl = (): string => {
  return String(import.meta.env.VITE_API_URL ?? 'http://localhost:4201');
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new game in the lobby
 */
export const createGame = async (
  gameName: string,
  creatorId: string,
  creatorName: string
): Promise<LobbyGame> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      name: gameName,
      creatorId,
      creatorName
    }),
  });

  const result = await response.json() as ApiResponse<LobbyGame>;

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to create game');
  }

  if (!result.data) {
    throw new Error('No game data returned');
  }

  return result.data;
};

/**
 * Fetch all games from the server
 */
export const fetchGames = async (): Promise<LobbyGame[]> => {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/games`);
  const result = await response.json() as ApiResponse<LobbyGame[]>;
  
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to fetch games');
  }

  return result.data || [];
};

/**
 * Create a game and fetch the updated list
 */
export const createGameAndFetchList = async (
  gameName: string,
  creatorId: string,
  creatorName: string
): Promise<LobbyGame | undefined> => {
  await createGame(gameName, creatorId, creatorName);
  
  // Get updated games list
  const games = await fetchGames();
  
  // Find the newly created game
  return games.find(g => g.name === gameName);
};