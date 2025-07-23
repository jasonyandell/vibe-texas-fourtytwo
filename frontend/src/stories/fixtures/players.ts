/**
 * Player fixtures for Storybook stories
 */

import { Player, PlayerPosition } from '@texas42/shared-types';
import { exampleHands } from './dominoes';

// Standard player names
export const playerNames = {
  north: 'Alice',
  east: 'Bob',
  south: 'Charlie',
  west: 'Diana',
};

// Basic player set (no hands)
export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: playerNames.north,
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-2',
    name: playerNames.east,
    position: 'east',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-3',
    name: playerNames.south,
    position: 'south',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-4',
    name: playerNames.west,
    position: 'west',
    hand: [],
    isConnected: true,
    isReady: true,
  },
];

// Players with hands
export const playersWithHands: Player[] = [
  {
    ...mockPlayers[0],
    hand: exampleHands.strongHand,
  },
  {
    ...mockPlayers[1],
    hand: exampleHands.weakHand,
  },
  {
    ...mockPlayers[2],
    hand: exampleHands.balancedHand,
  },
  {
    ...mockPlayers[3],
    hand: exampleHands.strongHand.slice().reverse(), // Different strong hand
  },
];

// Players in various states
export const playersNotReady: Player[] = mockPlayers.map((player, index) => ({
  ...player,
  isReady: index < 2, // Only first two are ready
}));

export const playersWithDisconnected: Player[] = mockPlayers.map((player, index) => ({
  ...player,
  isConnected: index !== 2, // South player disconnected
}));

// Partial player sets
export const twoPlayers: Player[] = mockPlayers.slice(0, 2);
export const threePlayers: Player[] = mockPlayers.slice(0, 3);

// Helper functions
export function createPlayer(
  id: string,
  name: string,
  position: PlayerPosition,
  overrides?: Partial<Player>
): Player {
  return {
    id,
    name,
    position,
    hand: [],
    isConnected: true,
    isReady: true,
    ...overrides,
  };
}

export function createPlayerSet(names: string[] = Object.values(playerNames)): Player[] {
  const positions: PlayerPosition[] = ['north', 'east', 'south', 'west'];
  return names.slice(0, 4).map((name, index) =>
    createPlayer(`player-${index + 1}`, name, positions[index])
  );
}

export function getPlayerByPosition(players: Player[], position: PlayerPosition): Player | undefined {
  return players.find(p => p.position === position);
}

export function getPartnership(position: PlayerPosition): 'northSouth' | 'eastWest' {
  return position === 'north' || position === 'south' ? 'northSouth' : 'eastWest';
}

export function getPartnerPosition(position: PlayerPosition): PlayerPosition {
  switch (position) {
    case 'north': return 'south';
    case 'south': return 'north';
    case 'east': return 'west';
    case 'west': return 'east';
  }
}

// Test scenarios
export const playerScenarios = {
  allReady: mockPlayers,
  waitingForPlayers: twoPlayers,
  oneDisconnected: playersWithDisconnected,
  mixedReadyStates: playersNotReady,
  withHands: playersWithHands,
  spectatorView: mockPlayers, // All players visible to spectator
};