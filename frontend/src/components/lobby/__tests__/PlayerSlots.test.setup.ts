import { vi } from 'vitest';
import { Player } from '../PlayerSlots';

export const mockPlayers: (Player | null)[] = [
  { id: 'player1', name: 'Alice', position: 'north', isReady: true },
  { id: 'player2', name: 'Bob', position: 'east', isReady: false },
  null, // Empty slot
  { id: 'player4', name: 'Charlie', position: 'west', isReady: true }
];

export const mockHandlers = {
  onJoinSlot: vi.fn()
};