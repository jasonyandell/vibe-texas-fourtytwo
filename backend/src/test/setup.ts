import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Global test setup
beforeAll(async () => {
  // Setup test database connection
  // Setup test Redis connection
  // Any other global setup
})

afterAll(async () => {
  // Cleanup test database
  // Cleanup test Redis
  // Any other global cleanup
})

beforeEach(async () => {
  // Reset test data before each test
})

afterEach(async () => {
  // Cleanup after each test
})

// Test utilities
export const createTestGame = () => {
  // Helper to create test game data
}

export const createTestPlayer = (name: string = 'Test Player') => {
  // Helper to create test player data
  return {
    id: `test-player-${Date.now()}`,
    name,
    position: 'north' as const,
    hand: [],
    isConnected: true,
    isReady: false
  }
}
