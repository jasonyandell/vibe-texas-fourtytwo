/**
 * Type Guards and Validation Functions
 * Runtime type validation for Texas 42 game types
 */
import { DominoSuit } from './trump';
import { Bid } from './bidding';
import { Player, GameState, LobbyState, BiddingState, ScoringState, Trick, PlayerPosition, GamePhase, createEmptyGameState, createEmptyLobbyState, createEmptyBiddingState, createEmptyScoringState } from './game-state';
export { isValidDomino, createDomino } from './dominoes';
/**
 * Validates if a value is a valid player
 */
export declare function isValidPlayer(value: unknown): value is Player;
/**
 * Validates if a value is a valid bid
 */
export declare function isValidBid(value: unknown): value is Bid;
/**
 * Validates if a value is a valid trick
 */
export declare function isValidTrick(value: unknown): value is Trick;
/**
 * Validates if a value is a valid bidding state
 */
export declare function isValidBiddingState(value: unknown): value is BiddingState;
/**
 * Validates if a value is a valid scoring state
 */
export declare function isValidScoringState(value: unknown): value is ScoringState;
/**
 * Validates if a value is a valid game state
 */
export declare function isValidGameState(value: unknown): value is GameState;
/**
 * Validates if a value is a valid lobby state
 */
export declare function isValidLobbyState(value: unknown): value is LobbyState;
/**
 * Validates player position enum
 */
export declare function validatePlayerPosition(value: unknown): value is PlayerPosition;
/**
 * Validates game phase enum
 */
export declare function validateGamePhase(value: unknown): value is GamePhase;
/**
 * Validates domino suit enum
 */
export declare function validateDominoSuit(value: unknown): value is DominoSuit;
export { createEmptyGameState, createEmptyLobbyState, createEmptyBiddingState, createEmptyScoringState };
//# sourceMappingURL=type-guards.d.ts.map