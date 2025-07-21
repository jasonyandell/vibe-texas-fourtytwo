import { createDomino } from '@/types/texas42'
import { createEmptyGameState } from '@texas42/shared-types'
import type { GameState } from '@texas42/shared-types'

export const generateAllDominoes = () => {
  const dominoes = []
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low))
    }
  }
  return dominoes
}

export const createMockGameState = (gameId = 'visual-test-game'): GameState => {
  const allDominoes = generateAllDominoes()
  const mockGameState = createEmptyGameState(gameId)
  
  mockGameState.phase = 'playing'
  mockGameState.players = [
    {
      id: 'north-player',
      name: 'North Player',
      position: 'north',
      hand: allDominoes.slice(0, 7),
      isConnected: true,
      isReady: true
    },
    {
      id: 'east-player',
      name: 'East Player',
      position: 'east',
      hand: allDominoes.slice(7, 14),
      isConnected: true,
      isReady: true
    },
    {
      id: 'south-player',
      name: 'South Player',
      position: 'south',
      hand: allDominoes.slice(14, 21),
      isConnected: true,
      isReady: true
    },
    {
      id: 'west-player',
      name: 'West Player',
      position: 'west',
      hand: allDominoes.slice(21, 28),
      isConnected: true,
      isReady: true
    }
  ]
  mockGameState.dealer = 'north-player'
  mockGameState.currentPlayer = 'north-player'
  mockGameState.partnerships.northSouth.currentHandScore = 15
  mockGameState.partnerships.eastWest.currentHandScore = 12
  mockGameState.gameScore = { northSouth: 3, eastWest: 2 }
  mockGameState.trump = 'sixes'
  
  return mockGameState
}

export const createResponsiveTestGameState = (gameId = 'responsive-test-game'): GameState => {
  const allDominoes = generateAllDominoes()
  const responsiveGameState = createEmptyGameState(gameId)
  
  responsiveGameState.phase = 'playing'
  responsiveGameState.players = [
    {
      id: 'test-player',
      name: 'Test Player',
      position: 'north',
      hand: allDominoes.slice(0, 7),
      isConnected: true,
      isReady: true
    }
  ]
  responsiveGameState.dealer = 'test-player'
  responsiveGameState.currentPlayer = 'test-player'
  
  return responsiveGameState
}