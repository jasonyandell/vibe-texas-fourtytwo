import { describe, it, expect, beforeEach } from 'vitest'
import { GameEngine } from '../engine'

describe('GameEngine', () => {
  let gameEngine: GameEngine

  beforeEach(() => {
    gameEngine = new GameEngine()
  })

  describe('createGame', () => {
    it('should create a new game with correct initial state', () => {
      const game = gameEngine.createGame()
      
      expect(game.id).toBeDefined()
      expect(game.phase).toBe('bidding')
      expect(game.players).toHaveLength(0)
      expect(game.boneyard).toHaveLength(28) // Full domino set
      expect(game.partnerships.northSouth.currentHandScore).toBe(0)
      expect(game.partnerships.eastWest.currentHandScore).toBe(0)
      expect(game.createdAt).toBeDefined()
      expect(game.updatedAt).toBeDefined()
    })

    it('should generate unique game IDs', () => {
      const game1 = gameEngine.createGame()
      const game2 = gameEngine.createGame()
      
      expect(game1.id).not.toBe(game2.id)
    })
  })

  describe('getGame', () => {
    it('should return the correct game', () => {
      const game = gameEngine.createGame()
      const retrieved = gameEngine.getGame(game.id)
      
      expect(retrieved).toBe(game)
    })

    it('should return undefined for non-existent game', () => {
      const retrieved = gameEngine.getGame('non-existent-id')
      
      expect(retrieved).toBeUndefined()
    })
  })

  describe('joinGame', () => {
    it('should allow players to join a game', () => {
      const game = gameEngine.createGame()
      const success = gameEngine.joinGame(game.id, 'player1', 'Player One')
      
      expect(success).toBe(true)
      
      const updatedGame = gameEngine.getGame(game.id)
      expect(updatedGame?.players).toHaveLength(1)
      expect(updatedGame?.players[0].name).toBe('Player One')
      expect(updatedGame?.players[0].position).toBe('north')
    })

    it('should assign different positions to players', () => {
      const game = gameEngine.createGame()
      
      gameEngine.joinGame(game.id, 'player1', 'Player One')
      gameEngine.joinGame(game.id, 'player2', 'Player Two')
      
      const updatedGame = gameEngine.getGame(game.id)
      const positions = updatedGame?.players.map(p => p.position)
      
      expect(positions).toContain('north')
      expect(positions).toContain('east')
      expect(new Set(positions).size).toBe(2) // All positions should be unique
    })

    it('should not allow more than 4 players', () => {
      const game = gameEngine.createGame()
      
      // Add 4 players
      gameEngine.joinGame(game.id, 'player1', 'Player One')
      gameEngine.joinGame(game.id, 'player2', 'Player Two')
      gameEngine.joinGame(game.id, 'player3', 'Player Three')
      gameEngine.joinGame(game.id, 'player4', 'Player Four')
      
      // Try to add 5th player
      const success = gameEngine.joinGame(game.id, 'player5', 'Player Five')
      
      expect(success).toBe(false)
      
      const updatedGame = gameEngine.getGame(game.id)
      expect(updatedGame?.players).toHaveLength(4)
    })
  })
})
