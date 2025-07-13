import { FastifyPluginAsync } from 'fastify'
import { GameEngine } from '@/game/engine.js'

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  const gameEngine = new GameEngine()

  // Get all available games
  fastify.get('/games', async (_request, _reply) => {
    const games = gameEngine.getAvailableGames()
    return {
      success: true,
      data: games
    }
  })

  // Create a new game
  fastify.post('/games', async (_request, reply) => {
    try {
      const game = gameEngine.createGame()
      return {
        success: true,
        data: game
      }
    } catch (error) {
      reply.code(500)
      return {
        success: false,
        error: 'Failed to create game'
      }
    }
  })

  // Get specific game state
  fastify.get('/games/:gameId', async (request, reply) => {
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
    } catch (error) {
      reply.code(500)
      return {
        success: false,
        error: 'Failed to get game'
      }
    }
  })

  // WebSocket endpoint for real-time game updates
  fastify.register(async function (fastify) {
    fastify.get('/games/:gameId/ws', { websocket: true }, (connection, request) => {
      const { gameId } = request.params as { gameId: string }
      
      connection.socket.on('message', (message: any) => {
        try {
          const data = JSON.parse(message.toString())
          // TODO: Handle game actions via WebSocket
          fastify.log.info(`WebSocket message for game ${gameId}:`, data)
        } catch (error) {
          fastify.log.error('Invalid WebSocket message:', error)
        }
      })
      
      connection.socket.on('close', () => {
        fastify.log.info(`WebSocket connection closed for game ${gameId}`)
      })
    })
  })
}
