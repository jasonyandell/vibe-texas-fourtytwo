import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import env from '@fastify/env'
import { gameRoutes } from '@/api/game'
import { healthRoutes } from '@/api/health'
import { envSchema } from '@/utils/env'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  }
})

async function start() {
  try {
    // Register environment validation
    await fastify.register(env, {
      schema: envSchema,
      dotenv: true
    })

    // Register CORS
    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
      credentials: true
    })

    // Register WebSocket support
    await fastify.register(websocket)

    // Register routes
    await fastify.register(healthRoutes, { prefix: '/api' })
    await fastify.register(gameRoutes, { prefix: '/api' })

    // Start server
    const port = parseInt(process.env.PORT || '4201')
    const host = process.env.HOST || '0.0.0.0'
    
    await fastify.listen({ port, host })
    
    fastify.log.info(`🎲 Texas 42 Backend running on http://${host}:${port}`)
    fastify.log.info(`🎯 Environment: ${process.env.NODE_ENV}`)
    
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  fastify.log.info('Received SIGINT, shutting down gracefully...')
  void fastify.close().then(() => {
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...')
  void fastify.close().then(() => {
    process.exit(0)
  })
})

void start()
