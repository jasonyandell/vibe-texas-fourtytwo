import { GameState } from '@texas42/shared-types'

export const createOptimisticScoreUpdate = (northSouthScore: number, eastWestScore: number) => {
  return (state: GameState) => ({
    ...state,
    partnerships: {
      ...state.partnerships,
      northSouth: {
        ...state.partnerships.northSouth,
        currentHandScore: northSouthScore
      },
      eastWest: {
        ...state.partnerships.eastWest,
        currentHandScore: eastWestScore
      }
    }
  })
}