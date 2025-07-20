import { Domino, DominoSuit, GamePhase, PlayerPosition } from '@/types/texas42'

export interface SampleTrick {
  id: string
  name: string
  description: string
  dominoes: Array<{
    domino: Domino
    position: PlayerPosition
    playerName: string
  }>
  winner: PlayerPosition
  winnerName: string
}

export interface SampleGameState {
  phase: GamePhase
  currentBid?: { amount: number; trump: DominoSuit; bidder: string }
  scores: { northSouth: number; eastWest: number }
  gameScore: { northSouth: number; eastWest: number }
  tricksWon: { northSouth: number; eastWest: number }
}