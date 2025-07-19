import { FastifyPluginCallback } from 'fastify'

export const healthRoutes: FastifyPluginCallback = (fastify, _options, done) => {
  // Health check endpoint
  fastify.get('/health', (_request, _reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    }
  })

  // Readiness check endpoint
  fastify.get('/ready', (_request, _reply) => {
    // TODO: Add database connectivity check
    // TODO: Add Redis connectivity check

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected', // TODO: actual check
        redis: 'connected'     // TODO: actual check
      }
    }
  })

  done()
}
