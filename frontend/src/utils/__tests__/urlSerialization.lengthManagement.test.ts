import { describe, it, expect } from 'vitest'
import {
  serializeGameStateToUrl,
  type UrlSerializationOptions
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Length Management', () => {
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

  describe('URL Length Management', () => {
    it('keeps URLs under 2048 characters by default', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      expect(urlParams.length).toBeLessThan(2048)
    })

    it('uses compression when URL would be too long', () => {
      const largeGameState = {
        ...mockGameState,
        tricks: Array(20).fill({
          id: 'trick-1',
          dominoes: [
            { domino: { id: '1', high: 6, low: 3 }, playerId: 'p1', position: 'north' },
            { domino: { id: '2', high: 5, low: 2 }, playerId: 'p2', position: 'east' },
            { domino: { id: '3', high: 4, low: 1 }, playerId: 'p3', position: 'south' },
            { domino: { id: '4', high: 3, low: 0 }, playerId: 'p4', position: 'west' }
          ]
        })
      }

      const urlParams = serializeGameStateToUrl(largeGameState, { useCompression: true })
      expect(urlParams).toContain('compressed=')
      expect(urlParams).toContain('version=2')
    })

    it('supports custom URL length limits', () => {
      const options: UrlSerializationOptions = { maxUrlLength: 1000 }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams.length).toBeLessThan(1000)
    })
  })

  describe('Partial Serialization', () => {
    it('serializes only specified fields', () => {
      const options: UrlSerializationOptions = {
        includeFields: ['id', 'phase', 'scores']
      }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).toContain('scores=')
      expect(urlParams).not.toContain('trump=')
      expect(urlParams).not.toContain('players=')
    })

    it('excludes specified fields', () => {
      const options: UrlSerializationOptions = {
        excludeFields: ['boneyard', 'tricks', 'createdAt', 'updatedAt']
      }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).not.toContain('boneyard=')
      expect(urlParams).not.toContain('tricks=')
    })
  })
})