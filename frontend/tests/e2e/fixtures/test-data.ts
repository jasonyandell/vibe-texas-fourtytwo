/**
 * Common test data for reuse across tests
 */
export const testData = {
  games: {
    waiting: {
      id: 'test-game-waiting',
      name: 'Waiting Game',
      creator: 'test-user',
      players: [
        { id: 'test-user', name: 'Test User', position: 'north' }
      ],
      playerCount: 1,
      maxPlayers: 4,
      status: 'waiting',
      gameCode: 'WAIT01',
      createdAt: new Date().toISOString()
    },
    full: {
      id: 'test-game-full',
      name: 'Full Game',
      creator: 'test-user',
      players: [
        { id: 'test-user-1', name: 'Player 1', position: 'north' },
        { id: 'test-user-2', name: 'Player 2', position: 'east' },
        { id: 'test-user-3', name: 'Player 3', position: 'south' },
        { id: 'test-user-4', name: 'Player 4', position: 'west' }
      ],
      playerCount: 4,
      maxPlayers: 4,
      status: 'playing',
      gameCode: 'FULL01',
      createdAt: new Date().toISOString()
    }
  },
  players: {
    creator: { id: 'creator-1', name: 'Game Creator' },
    joiner: { id: 'joiner-1', name: 'Game Joiner' },
    spectator: { id: 'spectator-1', name: 'Spectator' }
  }
};