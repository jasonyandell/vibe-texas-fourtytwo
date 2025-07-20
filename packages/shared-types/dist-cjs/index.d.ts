/**
 * Texas 42 Shared Types Package
 * Main export file for all shared types and utilities
 */
export type { Domino, DominoSet } from './dominoes';
export { calculateDominoPointValue, isCountDomino, isCountDominoByValues, createFullDominoSet, getCountDominoes, calculateTotalPoints, isValidDominoSet, DOMINO_CONSTANTS } from './dominoes';
export type { DominoSuit, TrumpSystem, DominoSuitMapping, TrumpHierarchy, NoTrumpConfig } from './trump';
export { getSuitValue, getSuitName, getDominoSuits, isTrumpDomino, getTrumpRank, compareTrumpDominoes, compareNonTrumpDominoes, getTrumpDominoes, createTrumpHierarchy, isValidTrumpSuit, createNoTrumpConfig, TRUMP_CONSTANTS } from './trump';
export type { SpecialContractType, Bid, SpecialContract, BidValidationResult } from './bidding';
export { BiddingValidationError, createPassBid, createRegularBid, createMarkBid, createSpecialContractBid, getSpecialContractAmount, convertBidToMarks, convertMarksToBid, validateBid, validateSpecialContract, isPassBid, isMarkBid, getMinimumBidAmount, BIDDING_CONSTANTS } from './bidding';
export type { PlayerPosition, Player } from './player';
export type { PartnershipTeam, Partnership, PartnershipState, PartnershipMarks, PartnershipScore } from './partnership';
export { createEmptyPartnershipState } from './partnership';
export type { PlayedDomino, Trick } from './trick';
export type { HandScore, ScoringState } from './scoring';
export { createEmptyScoringState } from './scoring';
export type { BiddingState } from './bidding-state';
export { createEmptyBiddingState } from './bidding-state';
export type { LobbyGame, LobbyState } from './lobby';
export { createEmptyLobbyState } from './lobby';
export type { ApiResponse, WebSocketMessage } from './api';
export type { GameAction } from './actions';
export type { GamePhase, GameState } from './game-state';
export { createEmptyGameState } from './game-state';
export { GAME_CONSTANTS } from './constants';
export type { ValidationResult, ValidationContext, ValidationError, RuleValidationFunction, DominoPlayValidationFunction, BidValidationFunction, GameStateValidationFunction } from './validation';
export { ValidationSeverity, ValidationErrorType, createValidResult, createInvalidResult, createValidationError, createValidationWarning, combineValidationResults, validateRequiredFields, validateFieldType, validateArrayLength, validateNumericRange, VALIDATION_CONSTANTS } from './validation';
export { isValidDomino, isValidPlayer, isValidGameState, isValidLobbyState, isValidBiddingState, isValidScoringState, isValidTrick, isValidBid, validatePlayerPosition, validateGamePhase, validateDominoSuit, createDomino } from './type-guards';
import type { Domino } from './dominoes';
import type { DominoSuit } from './trump';
import type { Player } from './player';
import type { GameState } from './game-state';
import type { Trick } from './trick';
import type { Bid } from './bidding';
import type { ValidationResult, ValidationError, ValidationContext } from './validation';
import type { Partnership, PartnershipState, PartnershipMarks, PartnershipTeam } from './partnership';
/**
 * Core game types that are frequently used together
 */
export type CoreGameTypes = {
    Domino: Domino;
    DominoSuit: DominoSuit;
    Player: Player;
    GameState: GameState;
    Bid: Bid;
    Trick: Trick;
};
/**
 * Validation types that are frequently used together
 */
export type ValidationTypes = {
    ValidationResult: ValidationResult;
    ValidationError: ValidationError;
    ValidationContext: ValidationContext;
};
/**
 * Partnership types that are frequently used together
 */
export type PartnershipTypes = {
    Partnership: Partnership;
    PartnershipState: PartnershipState;
    PartnershipMarks: PartnershipMarks;
    PartnershipTeam: PartnershipTeam;
};
/**
 * Legacy types and functions for frontend migration compatibility
 * Use these during migration from frontend types to shared types
 */
export type { LegacyGameState } from './frontend-compat';
export { convertToLegacyGameState, convertFromLegacyGameState, isValidLegacyGameState, createEmptyGameState as createEmptyLegacyGameState, createCompatibleBid, createCompatiblePlayedDomino, createCompatibleBiddingState, createCompatibleTrick } from './frontend-compat';
/**
 * Package version and metadata
 */
export declare const PACKAGE_INFO: {
    readonly name: "@texas42/shared-types";
    readonly version: "1.0.0";
    readonly description: "Shared TypeScript types for Texas 42 game frontend and backend";
    readonly author: "Texas 42 Development Team";
    readonly license: "MIT";
};
//# sourceMappingURL=index.d.ts.map