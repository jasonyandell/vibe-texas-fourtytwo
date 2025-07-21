import { GameState } from '@texas42/shared-types'

export class GameRepository {
  private games: Map<string, GameState> = new Map()
  private gameNames: Map<string, string> = new Map()

  set(gameId: string, game: GameState): void {
    this.games.set(gameId, game)
  }

  get(gameId: string): GameState | undefined {
    return this.games.get(gameId)
  }

  delete(gameId: string): void {
    this.games.delete(gameId)
    this.gameNames.delete(gameId)
  }

  setGameName(gameId: string, name: string): void {
    this.gameNames.set(gameId, name)
  }

  getGameName(gameId: string): string | undefined {
    return this.gameNames.get(gameId)
  }

  getAllGames(): GameState[] {
    return Array.from(this.games.values())
  }
}