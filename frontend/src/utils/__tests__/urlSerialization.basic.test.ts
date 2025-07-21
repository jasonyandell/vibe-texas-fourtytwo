import { describe, it, expect } from 'vitest'
import {
  serializeGameStateToUrl,
  parseGameStateFromUrl
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Basic', () => {
  const mockGameState = createEmptyGameState('game-123');
  // Add test-specific data
  mockGameState.phase = 'playing';
  mockGameState.players = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];
  mockGameState.dealer = 'p1';
  mockGameState.currentPlayer = 'p2';
  mockGameState.trump = 'sixes';
  mockGameState.partnerships.northSouth.currentHandScore = 15;
  mockGameState.partnerships.eastWest.currentHandScore = 23;
  mockGameState.gameScore = { northSouth: 1, eastWest: 2 };
  mockGameState.createdAt = '2024-01-01T00:00:00Z';
  mockGameState.updatedAt = '2024-01-01T00:00:00Z';

  describe('Basic Serialization', () => {
    it('serializes game state to URL parameters', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).toContain('trump=sixes')
      expect(urlParams).toContain('dealer=p1')
      expect(urlParams).toContain('currentPlayer=p2')
    })

    it('parses game state from URL parameters', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      const parsedState = parseGameStateFromUrl(urlParams)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
      expect(parsedState!.phase).toBe(mockGameState.phase)
      expect(parsedState!.trump).toBe(mockGameState.trump)
      expect(parsedState!.dealer).toBe(mockGameState.dealer)
      expect(parsedState!.currentPlayer).toBe(mockGameState.currentPlayer)
    })

    it('handles round-trip serialization correctly', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      const parsedState = parseGameStateFromUrl(urlParams)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
      expect(parsedState!.phase).toBe(mockGameState.phase)
      expect(parsedState!.players).toHaveLength(4)
      expect(parsedState!.partnerships.northSouth.currentHandScore).toBe(15)
      expect(parsedState!.partnerships.eastWest.currentHandScore).toBe(23)
    })
  })

  describe('Performance', () => {
    it('serializes large game state quickly', () => {
      const start = performance.now()
      serializeGameStateToUrl(mockGameState)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(50) // Under 50ms
    })

    it('parses URL quickly', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      const start = performance.now()
      parseGameStateFromUrl(urlParams)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(50) // Under 50ms
    })
  })
})