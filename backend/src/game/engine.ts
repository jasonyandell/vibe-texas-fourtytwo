import { nanoid } from 'nanoid'
import { GameState, Player } from '@texas42/shared-types'
import { DominoSet } from '@/game/dominoes'

export class GameEngine {
  private games: Map<string, GameState> = new Map()
  private gameNames: Map<string, string> = new Map() // Maps gameId to name
  private dominoSet = new DominoSet()

  createGame(gameName: string): GameState {
    const gameId = nanoid()
    this.gameNames.set(gameId, gameName)
    const game: GameState = {
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
    gameCode?: string
  }> {
    return Array.from(this.games.values()).map(game => ({
      id: game.id,
      name: this.gameNames.get(game.id) || `Texas 42 Game ${game.id.slice(0, 8)}`,
      playerCount: game.players.length,
      maxPlayers: 4,
      status: game.phase === 'finished' ? 'finished' : 
              game.players.length === 4 ? 'playing' : 'waiting',
      createdAt: game.createdAt,
      gameCode: this.getGameCode(game.id)
    }))
  }
  
  private generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
  
  private getGameCode(gameId: string): string | undefined {
    // For now, generate a deterministic code based on game ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      const index = gameId.charCodeAt(i % gameId.length) % chars.length
      code += chars.charAt(index)
    }
    return code
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
