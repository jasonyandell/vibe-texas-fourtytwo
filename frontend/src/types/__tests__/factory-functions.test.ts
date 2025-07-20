import { describe, it, expect } from 'vitest'
import {
  createEmptyGameState,
  createEmptyLobbyState,
  createEmptyBiddingState,
  createEmptyScoringState,
  isValidLobbyState,
  isValidBiddingState,
  isValidScoringState
} from '@texas42/shared-types'

describe('Factory Functions', () => {
  it('creates empty game state', () => {
    const gameState = createEmptyGameState('game-1')
    expect(gameState.id).toBe('game-1')
    expect(gameState.players).toHaveLength(0)
    expect(gameState.phase).toBe('bidding')
    expect(gameState.partnerships.northSouth.currentHandScore).toBe(0)
    expect(gameState.partnerships.eastWest.currentHandScore).toBe(0)
    expect(gameState.tricks).toHaveLength(0)
    expect(gameState.boneyard).toHaveLength(0)
    // Note: Empty game state won't pass full validation until players are added
  })

  it('creates empty lobby state', () => {
    const lobbyState = createEmptyLobbyState()
    expect(isValidLobbyState(lobbyState)).toBe(true)
    expect(lobbyState.availableGames).toHaveLength(0)
    expect(lobbyState.connectedPlayers).toBe(0)
  })

  it('creates empty bidding state', () => {
    const biddingState = createEmptyBiddingState()
    expect(isValidBiddingState(biddingState)).toBe(true)
    expect(biddingState.bidHistory).toHaveLength(0)
    expect(biddingState.biddingComplete).toBe(false)
    expect(biddingState.passCount).toBe(0)
    expect(biddingState.minimumBid).toBe(30)
  })

  it('creates empty scoring state', () => {
    const scoringState = createEmptyScoringState()
    expect(isValidScoringState(scoringState)).toBe(true)
    expect(scoringState.trickPoints).toBe(0)
    expect(scoringState.countDominoes).toHaveLength(0)
    expect(scoringState.bonusPoints).toBe(0)
    expect(scoringState.penaltyPoints).toBe(0)
    expect(scoringState.roundComplete).toBe(false)
  })
})