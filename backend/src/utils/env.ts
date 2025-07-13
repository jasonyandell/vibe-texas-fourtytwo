// Simple environment schema without external dependencies
export const envSchema = {
  type: 'object',
  required: ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'],
  properties: {
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'string', default: '4201' },
    HOST: { type: 'string', default: '0.0.0.0' },
    LOG_LEVEL: { type: 'string', default: 'info' },
    DATABASE_URL: { type: 'string' },
    REDIS_URL: { type: 'string', default: 'redis://localhost:6379' },
    JWT_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    CORS_ORIGIN: { type: 'string', default: 'http://localhost:4200' },
    GAME_SESSION_TIMEOUT: { type: 'string', default: '3600000' },
    MAX_CONCURRENT_GAMES: { type: 'string', default: '100' },
    MAX_PLAYERS_PER_GAME: { type: 'string', default: '4' },
  }
}
