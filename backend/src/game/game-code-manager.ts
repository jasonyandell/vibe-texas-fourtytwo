export class GameCodeManager {
  generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
  
  getGameCode(gameId: string): string {
    // Generate a deterministic code based on game ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      const index = gameId.charCodeAt(i % gameId.length) % chars.length
      code += chars.charAt(index)
    }
    return code
  }
}