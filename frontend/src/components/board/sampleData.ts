import { SampleTrick, SampleGameState } from './types'

export const sampleTricks: SampleTrick[] = [
  {
    id: 'trick-1',
    name: 'Opening Trick',
    description: 'First trick of the hand with mixed suits',
    dominoes: [
      { domino: { id: '6-5', high: 6, low: 5, pointValue: 10, isCountDomino: true }, position: 'north', playerName: 'North' },
      { domino: { id: '4-2', high: 4, low: 2, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' },
      { domino: { id: '6-4', high: 6, low: 4, pointValue: 0, isCountDomino: false }, position: 'south', playerName: 'South' },
      { domino: { id: '3-1', high: 3, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' }
    ],
    winner: 'north',
    winnerName: 'North'
  },
  {
    id: 'trick-2', 
    name: 'Trump Trick',
    description: 'Trick won with trump dominoes (sixes)',
    dominoes: [
      { domino: { id: '5-3', high: 5, low: 3, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' },
      { domino: { id: '6-6', high: 6, low: 6, pointValue: 10, isCountDomino: true }, position: 'south', playerName: 'South' },
      { domino: { id: '2-1', high: 2, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' },
      { domino: { id: '6-0', high: 6, low: 0, pointValue: 0, isCountDomino: false }, position: 'north', playerName: 'North' }
    ],
    winner: 'south',
    winnerName: 'South'
  },
  {
    id: 'trick-3',
    name: 'Count Domino Trick', 
    description: 'High-value trick with multiple count dominoes',
    dominoes: [
      { domino: { id: '5-5', high: 5, low: 5, pointValue: 10, isCountDomino: true }, position: 'south', playerName: 'South' },
      { domino: { id: '6-1', high: 6, low: 1, pointValue: 0, isCountDomino: false }, position: 'west', playerName: 'West' },
      { domino: { id: '5-0', high: 5, low: 0, pointValue: 5, isCountDomino: true }, position: 'north', playerName: 'North' },
      { domino: { id: '4-4', high: 4, low: 4, pointValue: 0, isCountDomino: false }, position: 'east', playerName: 'East' }
    ],
    winner: 'south',
    winnerName: 'South'
  }
]

export const sampleGameStates: SampleGameState[] = [
  {
    phase: 'playing',
    currentBid: { amount: 32, trump: 'sixes', bidder: 'North' },
    scores: { northSouth: 15, eastWest: 8 },
    gameScore: { northSouth: 2, eastWest: 1 },
    tricksWon: { northSouth: 3, eastWest: 2 }
  },
  {
    phase: 'scoring',
    currentBid: { amount: 35, trump: 'fours', bidder: 'East' },
    scores: { northSouth: 28, eastWest: 14 },
    gameScore: { northSouth: 2, eastWest: 2 },
    tricksWon: { northSouth: 4, eastWest: 3 }
  },
  {
    phase: 'finished',
    currentBid: { amount: 42, trump: 'blanks', bidder: 'South' },
    scores: { northSouth: 42, eastWest: 0 },
    gameScore: { northSouth: 3, eastWest: 2 },
    tricksWon: { northSouth: 7, eastWest: 0 }
  }
]