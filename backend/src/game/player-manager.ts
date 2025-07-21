import { GameState, Player } from '@texas42/shared-types'

export class PlayerManager {
  joinGame(game: GameState, playerId: string, playerName: string): boolean {
    if (game.players.length >= 4) {
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

  leaveGame(game: GameState, playerId: string): boolean {
    const playerIndex = game.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      return false
    }

    game.players.splice(playerIndex, 1)
    game.updatedAt = new Date().toISOString()

    return true
  }
}