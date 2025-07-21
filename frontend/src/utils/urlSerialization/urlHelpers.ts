/**
 * URL Helper functions for URL Serialization
 */

import { Player, Trick, Domino } from '@texas42/shared-types';
import { SerializedGameState } from './types';

/**
 * Creates URL parameters from serialized game state
 */
export function createUrlParams(serialized: SerializedGameState): string {
  const params = new URLSearchParams();

  params.set('version', serialized.version.toString());
  if (serialized.gameId) params.set('gameId', serialized.gameId);
  if (serialized.phase) params.set('phase', serialized.phase);
  if (serialized.players) params.set('players', JSON.stringify(serialized.players));
  if (serialized.dealer) params.set('dealer', serialized.dealer);
  if (serialized.scores) params.set('scores', JSON.stringify(serialized.scores));
  if (serialized.gameScore) params.set('gameScore', JSON.stringify(serialized.gameScore));

  if (serialized.currentPlayer) params.set('currentPlayer', serialized.currentPlayer);
  if (serialized.bidder) params.set('bidder', serialized.bidder);
  if (serialized.trump) params.set('trump', serialized.trump);
  if (serialized.tricks) params.set('tricks', JSON.stringify(serialized.tricks));
  if (serialized.boneyard) params.set('boneyard', JSON.stringify(serialized.boneyard));
  if (serialized.createdAt) params.set('createdAt', serialized.createdAt);
  if (serialized.updatedAt) params.set('updatedAt', serialized.updatedAt);

  return params.toString();
}

/**
 * Parses URL parameters to serialized game state
 */
export function parseUrlParams(params: URLSearchParams): SerializedGameState | null {
  try {
    const version = parseInt(params.get('version') || '1');
    const gameId = params.get('gameId');
    const phase = params.get('phase');
    const playersStr = params.get('players');
    const dealer = params.get('dealer');
    const scoresStr = params.get('scores');
    const gameScoreStr = params.get('gameScore');
    
    if (!gameId || !phase || !playersStr || !dealer || !scoresStr || !gameScoreStr) {
      return null;
    }
    
    const players = JSON.parse(playersStr) as Player[];
    const scores = JSON.parse(scoresStr) as { northSouth: number; eastWest: number };
    const gameScore = JSON.parse(gameScoreStr) as { northSouth: number; eastWest: number };
    
    const serialized: SerializedGameState = {
      version,
      gameId,
      phase,
      players,
      dealer,
      scores,
      gameScore
    };
    
    // Add optional fields
    const currentPlayer = params.get('currentPlayer');
    if (currentPlayer) serialized.currentPlayer = currentPlayer;
    
    const bidder = params.get('bidder');
    if (bidder) serialized.bidder = bidder;
    
    const trump = params.get('trump');
    if (trump) serialized.trump = trump;
    
    const tricksStr = params.get('tricks');
    if (tricksStr) serialized.tricks = JSON.parse(tricksStr) as Trick[];

    const boneyardStr = params.get('boneyard');
    if (boneyardStr) serialized.boneyard = JSON.parse(boneyardStr) as Domino[];
    
    const createdAt = params.get('createdAt');
    if (createdAt) serialized.createdAt = createdAt;
    
    const updatedAt = params.get('updatedAt');
    if (updatedAt) serialized.updatedAt = updatedAt;
    
    return serialized;
  } catch (error) {
    console.error('Failed to parse URL params:', error);
    return null;
  }
}