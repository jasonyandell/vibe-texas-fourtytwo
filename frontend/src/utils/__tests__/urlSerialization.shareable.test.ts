import { describe, it, expect } from 'vitest'
import {
  createShareableUrl,
  parseShareableUrl
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Shareable URLs', () => {
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

  describe('Shareable URLs', () => {
    it('creates shareable URL with base path', () => {
      const baseUrl = 'https://texas42.game'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      
      expect(shareableUrl.startsWith(baseUrl)).toBe(true)
      expect(shareableUrl).toContain('?')
    })

    it('parses shareable URL correctly', () => {
      const baseUrl = 'https://texas42.game/game'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      const parsedState = parseShareableUrl(shareableUrl)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
    })

    it('handles URL fragments and query parameters', () => {
      const baseUrl = 'https://texas42.game/game#section'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      
      expect(shareableUrl).toContain('#section')
      
      const parsedState = parseShareableUrl(shareableUrl)
      expect(parsedState).toBeDefined()
    })
  })
})