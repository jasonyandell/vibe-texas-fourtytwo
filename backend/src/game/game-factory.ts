import { nanoid } from 'nanoid'
import { GameState } from '@texas42/shared-types'
import { DominoSet } from '@/game/dominoes'

export class GameFactory {
  private dominoSet = new DominoSet()

  createInitialGameState(gameId: string): GameState {
    return {
      id: gameId,
      phase: 'bidding',
      players: [],
      partnerships: {
        northSouth: {
          players: ['', ''],
          currentHandScore: 0,
          marks: 0,
          totalGameScore: 0,
          tricksWon: 0,
          isBiddingTeam: false
        },
        eastWest: {
          players: ['', ''],
          currentHandScore: 0,
          marks: 0,
          totalGameScore: 0,
          tricksWon: 0,
          isBiddingTeam: false
        }
      },
      handNumber: 1,
      dealer: '',
      biddingState: {
        bidHistory: [],
        biddingComplete: false,
        passCount: 0,
        minimumBid: 30,
        forcedBidActive: false
      },
      tricks: [],
      boneyard: this.dominoSet.getFullSet(),
      scoringState: {
        trickPoints: 0,
        countDominoes: [],
        bonusPoints: 0,
        penaltyPoints: 0,
        roundComplete: false
      },
      handScores: [],
      marks: { northSouth: 0, eastWest: 0 },
      gameScore: { northSouth: 0, eastWest: 0 },
      marksToWin: 7,
      gameComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isValid: true,
      validationErrors: []
    }
  }

  generateGameId(): string {
    return nanoid()
  }
}