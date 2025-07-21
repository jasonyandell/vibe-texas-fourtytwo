import { Domino, DominoSuit } from '@/types/texas42'
import { TrumpSuitInfo } from '@/components/TrumpSuitCard'

// Trump suit definitions
export const trumpSuits: TrumpSuitInfo[] = [
  { suit: 'blanks', label: 'Blanks (0s)', description: 'All dominoes containing a blank', dominoCount: 7 },
  { suit: 'ones', label: 'Ones (1s)', description: 'All dominoes containing a 1', dominoCount: 7 },
  { suit: 'twos', label: 'Twos (2s)', description: 'All dominoes containing a 2', dominoCount: 7 },
  { suit: 'threes', label: 'Threes (3s)', description: 'All dominoes containing a 3', dominoCount: 7 },
  { suit: 'fours', label: 'Fours (4s)', description: 'All dominoes containing a 4', dominoCount: 7 },
  { suit: 'fives', label: 'Fives (5s)', description: 'All dominoes containing a 5', dominoCount: 7 },
  { suit: 'sixes', label: 'Sixes (6s)', description: 'All dominoes containing a 6', dominoCount: 7 }
]

// Convert trump suit to numeric value
export const getTrumpValue = (trump: DominoSuit): number => {
  switch (trump) {
    case 'blanks': return 0
    case 'ones': return 1
    case 'twos': return 2
    case 'threes': return 3
    case 'fours': return 4
    case 'fives': return 5
    case 'sixes': return 6
    default: return -1
  }
}

// Determine if a domino is trump for the given suit
export const isTrumpDomino = (domino: Domino, trump: DominoSuit): boolean => {
  if (trump === 'doubles') {
    return domino.high === domino.low
  }
  
  // Get the numeric value for the trump suit
  const trumpValue = getTrumpValue(trump)
  return domino.high === trumpValue || domino.low === trumpValue
}