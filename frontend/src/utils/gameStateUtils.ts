import { GameState } from '@/types/texas42';

export function formatGameState(gameState: GameState): string {
  // TODO: Implement game state serialization for URLs
  return JSON.stringify(gameState);
}

export function parseGameState(serialized: string): GameState | null {
  try {
    return JSON.parse(serialized) as GameState;
  } catch {
    return null;
  }
}