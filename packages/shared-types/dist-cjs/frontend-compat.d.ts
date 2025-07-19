/**
 * Frontend Compatibility Layer
 * Provides compatibility types and functions for migrating from frontend types
 */
import { GameState as SharedGameState, Player, Trick, BiddingState, ScoringState, PartnershipState, PlayerPosition, GamePhase, LobbyGame, LobbyState, GameAction, ApiResponse, WebSocketMessage, PlayedDomino } from './game-state';
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';
/**
 * Legacy GameState interface for frontend compatibility
 * This matches the structure expected by the existing frontend code
 */
export interface LegacyGameState {
    id: string;
    phase: GamePhase;
    players: Player[];
    currentPlayer?: string;
    dealer: string;
    bidder?: string;
    currentBid?: Bid;
    trump?: DominoSuit;
    tricks: Trick[];
    currentTrick?: Trick;
    scores: {
        northSouth: number;
        eastWest: number;
    };
    gameScore: {
        northSouth: number;
        eastWest: number;
    };
    boneyard: Domino[];
    biddingState?: BiddingState;
    scoringState?: ScoringState;
    partnershipState?: PartnershipState;
    createdAt: string;
    updatedAt: string;
}
/**
 * Convert shared GameState to legacy format for frontend compatibility
 */
export declare function convertToLegacyGameState(sharedState: SharedGameState): LegacyGameState;
/**
 * Convert legacy GameState to shared format
 */
export declare function convertFromLegacyGameState(legacyState: LegacyGameState): SharedGameState;
/**
 * Legacy validation function for GameState
 */
export declare function isValidLegacyGameState(value: unknown): value is LegacyGameState;
/**
 * Factory function to create empty legacy game state
 */
export declare function createEmptyGameState(gameId: string): LegacyGameState;
export type { Player, Trick, BiddingState, ScoringState, PartnershipState, PlayerPosition, GamePhase, LobbyGame, LobbyState, GameAction, ApiResponse, WebSocketMessage };
export type { Domino } from './dominoes';
export type { DominoSuit } from './trump';
export type { Bid } from './bidding';
export { isValidPlayer, isValidBid, isValidTrick, isValidBiddingState, isValidScoringState, isValidLobbyState, validatePlayerPosition, validateGamePhase, validateDominoSuit } from './type-guards';
export { createEmptyLobbyState, createEmptyBiddingState, createEmptyScoringState } from './game-state';
export { calculateDominoPointValue, isCountDomino, createDomino, createFullDominoSet } from './dominoes';
/**
 * Create a compatible Bid object for frontend use
 */
export declare function createCompatibleBid(playerId: string, amount: number, trump?: DominoSuit): Bid;
/**
 * Create a compatible PlayedDomino object for frontend use
 */
export declare function createCompatiblePlayedDomino(domino: Domino, playerId: string, position: PlayerPosition, playOrder?: number): {
    domino: Domino;
    playerId: string;
    position: PlayerPosition;
    playOrder: number;
    timestamp: string;
};
/**
 * Create a compatible BiddingState object for frontend use
 */
export declare function createCompatibleBiddingState(overrides?: Partial<BiddingState>): BiddingState;
/**
 * Create a compatible Trick object for frontend use
 */
export declare function createCompatibleTrick(id: string, dominoes?: PlayedDomino[], trickNumber?: number, overrides?: Partial<Trick>): Trick;
//# sourceMappingURL=frontend-compat.d.ts.map