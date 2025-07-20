import { DominoSuit } from '@/types/texas42'

// Sample bidding data for demonstration
export interface SampleBid {
  playerId: string
  playerName: string
  amount: number | null // null for pass
  trump?: DominoSuit
  isWinning: boolean
}

// Sample bidding history for demonstration
export const sampleBiddingHistory: SampleBid[] = [
  { playerId: 'north', playerName: 'North', amount: null, isWinning: false }, // pass
  { playerId: 'east', playerName: 'East', amount: 30, trump: 'fours', isWinning: false },
  { playerId: 'south', playerName: 'South', amount: null, isWinning: false }, // pass
  { playerId: 'west', playerName: 'West', amount: 35, trump: 'sixes', isWinning: true }
]