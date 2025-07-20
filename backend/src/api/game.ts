import { FastifyPluginCallback } from 'fastify'
import { GameEngine } from '@/game/engine'

export const gameRoutes: FastifyPluginCallback = (fastify, _options, done) => {
  const gameEngine = new GameEngine()

  // Get all available games
  fastify.get('/games', (_request, _reply) => {
    const games = gameEngine.getAvailableGames()
    return {
      success: true,
      data: games
    }
  })

  // Create a new game
  fastify.post('/games', (request, reply) => {
    try {
      const body = request.body as { name?: string; creatorId?: string; creatorName?: string }
      
      // Validate game name
      if (!body.name || typeof body.name !== 'string') {
        reply.code(400)
        return {
          success: false,
          error: 'Game name is required'
        }
      }
      
      const trimmedName = body.name.trim()
      if (trimmedName.length < 3) {
        reply.code(400)
        return {
          success: false,
          error: 'Game name must be at least 3 characters'
        }
      }
      
      if (trimmedName.length > 50) {
        reply.code(400)
        return {
          success: false,
          error: 'Game name must be less than 50 characters'
        }
      }
      
      // Check for duplicate names
      const existingGames = gameEngine.getAvailableGames()
      if (existingGames.some(g => g.name === trimmedName)) {
        reply.code(400)
        return {
          success: false,
          error: 'A game with this name already exists'
        }
      }
      
      const game = gameEngine.createGame(trimmedName)
      
      // Auto-join creator if provided
      if (body.creatorId && body.creatorName) {
        gameEngine.joinGame(game.id, body.creatorId, body.creatorName)
      }
      
      // Return the updated game info
      const gameInfo = gameEngine.getAvailableGames().find(g => g.id === game.id)
      
      return {
        success: true,
        data: gameInfo || game
      }
    } catch (_error) {
      reply.code(500)
      return {
        success: false,
        error: 'Failed to create game'
      }
    }
  })

  // Get specific game state
  fastify.get('/games/:gameId', (request, reply) => {
    const { gameId } = request.params as { gameId: string }

    try {
      const game = gameEngine.getGame(gameId)
      if (!game) {
        reply.code(404)
        return {
          success: false,
          error: 'Game not found'
        }
      }

      return {
        success: true,
        data: game
      }
    } catch (_error) {
      reply.code(500)
      return {
        success: false,
        error: 'Failed to get game'
      }
    }
  })

  // WebSocket endpoint for real-time game updates
  fastify.register(function (fastify) {
    fastify.get('/games/:gameId/ws', { websocket: true }, (connection, request) => {
      const { gameId } = request.params as { gameId: string }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      connection.socket.on('message', (message: Buffer | string) => {
        try {
          const data: unknown = JSON.parse(message.toString())
          // TODO: Handle game actions via WebSocket
          fastify.log.info(`WebSocket message for game ${gameId}:`, data)
        } catch (_error) {
          fastify.log.error('Invalid WebSocket message:', _error)
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      connection.socket.on('close', () => {
        fastify.log.info(`WebSocket connection closed for game ${gameId}`)
      })
    })
  })

  done()
}
