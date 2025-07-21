import { GameState } from '@texas42/shared-types'
import { GameRepository } from '@/game/game-repository'
import { GameFactory } from '@/game/game-factory'
import { GameCodeManager } from '@/game/game-code-manager'
import { PlayerManager } from '@/game/player-manager'

export class GameEngine {
  private repository = new GameRepository()
  private factory = new GameFactory()
  private codeManager = new GameCodeManager()
  private playerManager = new PlayerManager()

  createGame(gameName: string): GameState {
    const gameId = this.factory.generateGameId()
    const game = this.factory.createInitialGameState(gameId)
    
    this.repository.set(gameId, game)
    this.repository.setGameName(gameId, gameName)
    
    return game
  }

  getGame(gameId: string): GameState | undefined {
    return this.repository.get(gameId)
  }

  getAvailableGames(): Array<{
    id: string
    name: string
    playerCount: number
    maxPlayers: number
    status: string
    createdAt: string
    gameCode?: string
  }> {
    return this.repository.getAllGames().map(game => ({
      id: game.id,
      name: this.repository.getGameName(game.id) || `Texas 42 Game ${game.id.slice(0, 8)}`,
      playerCount: game.players.length,
      maxPlayers: 4,
      status: game.phase === 'finished' ? 'finished' : 
              game.players.length === 4 ? 'playing' : 'waiting',
      createdAt: game.createdAt,
      gameCode: this.codeManager.getGameCode(game.id)
    }))
  }

  joinGame(gameId: string, playerId: string, playerName: string): boolean {
    const game = this.repository.get(gameId)
    if (!game) {
      return false
    }

    return this.playerManager.joinGame(game, playerId, playerName)
  }

  leaveGame(gameId: string, playerId: string): boolean {
    const game = this.repository.get(gameId)
    if (!game) {
      return false
    }

    const result = this.playerManager.leaveGame(game, playerId)

    // Clean up empty games
    if (game.players.length === 0) {
      this.repository.delete(gameId)
    }

    return result
  }

  // TODO: Implement game logic methods
  // - dealDominoes()
  // - placeBid()
  // - playDomino()
  // - calculateScore()
  // - etc.
}