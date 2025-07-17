import { nanoid } from 'nanoid'
import { GameState, Player } from '@/types/texas42'
import { DominoSet } from '@/game/dominoes'

export class GameEngine {
  private games: Map<string, GameState> = new Map()
  private dominoSet = new DominoSet()

  createGame(): GameState {
    const gameId = nanoid()
    const game: GameState = {
      id: gameId,
      phase: 'bidding',
      players: [],
      dealer: '',
      scores: { northSouth: 0, eastWest: 0 },
      gameScore: { northSouth: 0, eastWest: 0 },
      tricks: [],
      boneyard: this.dominoSet.getFullSet(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.games.set(gameId, game)
    return game
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId)
  }

  getAvailableGames(): Array<{
    id: string
    name: string
    playerCount: number
    maxPlayers: number
    status: string
    createdAt: string
  }> {
    return Array.from(this.games.values()).map(game => ({
      id: game.id,
      name: `Texas 42 Game ${game.id.slice(0, 8)}`,
      playerCount: game.players.length,
      maxPlayers: 4,
      status: game.phase === 'finished' ? 'finished' : 
              game.players.length === 4 ? 'playing' : 'waiting',
      createdAt: game.createdAt
    }))
  }

  joinGame(gameId: string, playerId: string, playerName: string): boolean {
    const game = this.games.get(gameId)
    if (!game || game.players.length >= 4) {
      return false
    }

    // Determine player position
    const positions = ['north', 'east', 'south', 'west'] as const
    const takenPositions = game.players.map(p => p.position)
    const availablePosition = positions.find(pos => !takenPositions.includes(pos))

    if (!availablePosition) {
      return false
    }

    const player: Player = {
      id: playerId,
      name: playerName,
      position: availablePosition,
      hand: [],
      isConnected: true,
      isReady: false
    }

    game.players.push(player)
    game.updatedAt = new Date().toISOString()

    // Set dealer if this is the first player
    if (game.players.length === 1) {
      game.dealer = playerId
    }

    return true
  }

  leaveGame(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId)
    if (!game) {
      return false
    }

    const playerIndex = game.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      return false
    }

    game.players.splice(playerIndex, 1)
    game.updatedAt = new Date().toISOString()

    // Clean up empty games
    if (game.players.length === 0) {
      this.games.delete(gameId)
    }

    return true
  }

  // TODO: Implement game logic methods
  // - dealDominoes()
  // - placeBid()
  // - playDomino()
  // - calculateScore()
  // - etc.
}
