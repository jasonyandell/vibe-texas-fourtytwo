import { Player } from '@/types/texas42'
import { createFullDominoSet } from '@/types/texas42'

export const createSamplePlayers = (): Player[] => {
  const { dominoes } = createFullDominoSet()
  
  const hands = [
    dominoes.slice(0, 7),   // Alice (North)
    dominoes.slice(7, 14),  // Bob (East)
    dominoes.slice(14, 21), // Charlie (South)
    dominoes.slice(21, 28)  // Diana (West)
  ]

  return [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: hands[0],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: hands[1],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'Charlie',
      position: 'south',
      hand: hands[2],
      isConnected: true,
      isReady: false
    },
    {
      id: 'player-4',
      name: 'Diana',
      position: 'west',
      hand: hands[3],
      isConnected: true,
      isReady: true
    }
  ]
}