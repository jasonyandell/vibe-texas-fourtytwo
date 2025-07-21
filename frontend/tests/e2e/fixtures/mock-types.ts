export interface MockApiOptions {
  gameState?: 'board' | 'dominoes' | 'players' | 'custom';
  customGameState?: Record<string, unknown>;
  enableLobby?: boolean;
  lobbyGames?: Record<string, unknown>[];
}

export interface MockGame {
  id: string;
  name: string;
  creator: string;
  players: Array<{
    id: string;
    name: string;
    position: string;
  }>;
  playerCount: number;
  maxPlayers: number;
  status: string;
  gameCode: string;
  createdAt: string;
}