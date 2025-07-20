/**
 * Converter functions for URL Serialization
 */

import { GameState, GamePhase, DominoSuit } from '@texas42/shared-types';
import { SerializedGameState } from './types';
import { isValidGameState } from './validators';

/**
 * Converts serialized game state to GameState object
 */
export function convertToGameState(serialized: SerializedGameState): GameState | null {
  try {
    const gameState: GameState = {
      id: serialized.gameId,
      phase: serialized.phase as GamePhase,
      players: serialized.players,
      partnerships: {
        northSouth: {
          players: ['', ''],
          currentHandScore: serialized.scores.northSouth,
          marks: 0,
          totalGameScore: serialized.gameScore.northSouth,
          tricksWon: 0,
          isBiddingTeam: false
        },
        eastWest: {
          players: ['', ''],
          currentHandScore: serialized.scores.eastWest,
          marks: 0,
          totalGameScore: serialized.gameScore.eastWest,
          tricksWon: 0,
          isBiddingTeam: false
        }
      },
      handNumber: 1,
      dealer: serialized.dealer,
      biddingState: {
        bidHistory: [],
        biddingComplete: false,
        passCount: 0,
        minimumBid: 30,
        forcedBidActive: false
      },
      tricks: serialized.tricks || [],
      boneyard: serialized.boneyard || [],
      scoringState: {
        trickPoints: 0,
        countDominoes: [],
        bonusPoints: 0,
        penaltyPoints: 0,
        roundComplete: false
      },
      handScores: [],
      marks: { northSouth: 0, eastWest: 0 },
      gameScore: serialized.gameScore,
      marksToWin: 7,
      gameComplete: false,
      createdAt: serialized.createdAt || new Date().toISOString(),
      updatedAt: serialized.updatedAt || new Date().toISOString(),
      isValid: true,
      validationErrors: []
    };

    if (serialized.currentPlayer) gameState.currentPlayer = serialized.currentPlayer;
    if (serialized.bidder && serialized.trump) {
      gameState.currentBid = {
        playerId: serialized.bidder,
        amount: 30, // Default minimum bid
        trump: serialized.trump as DominoSuit,
        isSpecialContract: false,
        timestamp: new Date().toISOString()
      };
    }
    if (serialized.trump) gameState.trump = serialized.trump as DominoSuit;
    
    // Validate the converted state
    if (!isValidGameState(gameState)) {
      console.error('Converted game state is invalid');
      return null;
    }
    
    return gameState;
  } catch (error) {
    console.error('Failed to convert to game state:', error);
    return null;
  }
}