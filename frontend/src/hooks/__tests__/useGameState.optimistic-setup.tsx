import { vi } from 'vitest'
import { createEmptyGameState } from '@texas42/shared-types'
import React from 'react'
import { GameStateProvider } from '@/contexts/GameStateContext'

// Mock the URL serialization functions
vi.mock('@/utils/urlSerialization', () => ({
  serializeGameStateToUrl: vi.fn(() => 'mocked-url-params'),
  parseGameStateFromUrl: vi.fn(() => null)
}))

export const createMockGameState = () => {
  const mockGameState = createEmptyGameState('test-game');
  // Add test-specific data
  mockGameState.phase = 'bidding';
  mockGameState.players = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];
  mockGameState.dealer = 'p1';
  mockGameState.createdAt = '2024-01-01T00:00:00Z';
  mockGameState.updatedAt = '2024-01-01T00:00:00Z';
  return mockGameState;
}

export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameStateProvider>{children}</GameStateProvider>
)