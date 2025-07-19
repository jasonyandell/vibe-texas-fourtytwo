"use strict";
/**
 * Texas 42 Shared Types Package
 * Main export file for all shared types and utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArrayLength = exports.validateFieldType = exports.validateRequiredFields = exports.combineValidationResults = exports.createValidationWarning = exports.createValidationError = exports.createInvalidResult = exports.createValidResult = exports.ValidationErrorType = exports.ValidationSeverity = exports.GAME_CONSTANTS = exports.createEmptyLobbyState = exports.createEmptyBiddingState = exports.createEmptyScoringState = exports.createEmptyPartnershipState = exports.createEmptyGameState = exports.BIDDING_CONSTANTS = exports.getMinimumBidAmount = exports.isMarkBid = exports.isPassBid = exports.validateSpecialContract = exports.validateBid = exports.convertMarksToBid = exports.convertBidToMarks = exports.getSpecialContractAmount = exports.createSpecialContractBid = exports.createMarkBid = exports.createRegularBid = exports.createPassBid = exports.BiddingValidationError = exports.TRUMP_CONSTANTS = exports.createNoTrumpConfig = exports.isValidTrumpSuit = exports.createTrumpHierarchy = exports.getTrumpDominoes = exports.compareNonTrumpDominoes = exports.compareTrumpDominoes = exports.getTrumpRank = exports.isTrumpDomino = exports.getDominoSuits = exports.getSuitName = exports.getSuitValue = exports.DOMINO_CONSTANTS = exports.isValidDominoSet = exports.calculateTotalPoints = exports.getCountDominoes = exports.createFullDominoSet = exports.isCountDominoByValues = exports.isCountDomino = exports.calculateDominoPointValue = void 0;
exports.PACKAGE_INFO = exports.createCompatibleTrick = exports.createCompatibleBiddingState = exports.createCompatiblePlayedDomino = exports.createCompatibleBid = exports.createEmptyLegacyGameState = exports.isValidLegacyGameState = exports.convertFromLegacyGameState = exports.convertToLegacyGameState = exports.createDomino = exports.validateDominoSuit = exports.validateGamePhase = exports.validatePlayerPosition = exports.isValidBid = exports.isValidTrick = exports.isValidScoringState = exports.isValidBiddingState = exports.isValidLobbyState = exports.isValidGameState = exports.isValidPlayer = exports.isValidDomino = exports.VALIDATION_CONSTANTS = exports.validateNumericRange = void 0;
var dominoes_1 = require("./dominoes");
Object.defineProperty(exports, "calculateDominoPointValue", { enumerable: true, get: function () { return dominoes_1.calculateDominoPointValue; } });
Object.defineProperty(exports, "isCountDomino", { enumerable: true, get: function () { return dominoes_1.isCountDomino; } });
Object.defineProperty(exports, "isCountDominoByValues", { enumerable: true, get: function () { return dominoes_1.isCountDominoByValues; } });
Object.defineProperty(exports, "createFullDominoSet", { enumerable: true, get: function () { return dominoes_1.createFullDominoSet; } });
Object.defineProperty(exports, "getCountDominoes", { enumerable: true, get: function () { return dominoes_1.getCountDominoes; } });
Object.defineProperty(exports, "calculateTotalPoints", { enumerable: true, get: function () { return dominoes_1.calculateTotalPoints; } });
Object.defineProperty(exports, "isValidDominoSet", { enumerable: true, get: function () { return dominoes_1.isValidDominoSet; } });
Object.defineProperty(exports, "DOMINO_CONSTANTS", { enumerable: true, get: function () { return dominoes_1.DOMINO_CONSTANTS; } });
var trump_1 = require("./trump");
Object.defineProperty(exports, "getSuitValue", { enumerable: true, get: function () { return trump_1.getSuitValue; } });
Object.defineProperty(exports, "getSuitName", { enumerable: true, get: function () { return trump_1.getSuitName; } });
Object.defineProperty(exports, "getDominoSuits", { enumerable: true, get: function () { return trump_1.getDominoSuits; } });
Object.defineProperty(exports, "isTrumpDomino", { enumerable: true, get: function () { return trump_1.isTrumpDomino; } });
Object.defineProperty(exports, "getTrumpRank", { enumerable: true, get: function () { return trump_1.getTrumpRank; } });
Object.defineProperty(exports, "compareTrumpDominoes", { enumerable: true, get: function () { return trump_1.compareTrumpDominoes; } });
Object.defineProperty(exports, "compareNonTrumpDominoes", { enumerable: true, get: function () { return trump_1.compareNonTrumpDominoes; } });
Object.defineProperty(exports, "getTrumpDominoes", { enumerable: true, get: function () { return trump_1.getTrumpDominoes; } });
Object.defineProperty(exports, "createTrumpHierarchy", { enumerable: true, get: function () { return trump_1.createTrumpHierarchy; } });
Object.defineProperty(exports, "isValidTrumpSuit", { enumerable: true, get: function () { return trump_1.isValidTrumpSuit; } });
Object.defineProperty(exports, "createNoTrumpConfig", { enumerable: true, get: function () { return trump_1.createNoTrumpConfig; } });
Object.defineProperty(exports, "TRUMP_CONSTANTS", { enumerable: true, get: function () { return trump_1.TRUMP_CONSTANTS; } });
var bidding_1 = require("./bidding");
Object.defineProperty(exports, "BiddingValidationError", { enumerable: true, get: function () { return bidding_1.BiddingValidationError; } });
Object.defineProperty(exports, "createPassBid", { enumerable: true, get: function () { return bidding_1.createPassBid; } });
Object.defineProperty(exports, "createRegularBid", { enumerable: true, get: function () { return bidding_1.createRegularBid; } });
Object.defineProperty(exports, "createMarkBid", { enumerable: true, get: function () { return bidding_1.createMarkBid; } });
Object.defineProperty(exports, "createSpecialContractBid", { enumerable: true, get: function () { return bidding_1.createSpecialContractBid; } });
Object.defineProperty(exports, "getSpecialContractAmount", { enumerable: true, get: function () { return bidding_1.getSpecialContractAmount; } });
Object.defineProperty(exports, "convertBidToMarks", { enumerable: true, get: function () { return bidding_1.convertBidToMarks; } });
Object.defineProperty(exports, "convertMarksToBid", { enumerable: true, get: function () { return bidding_1.convertMarksToBid; } });
Object.defineProperty(exports, "validateBid", { enumerable: true, get: function () { return bidding_1.validateBid; } });
Object.defineProperty(exports, "validateSpecialContract", { enumerable: true, get: function () { return bidding_1.validateSpecialContract; } });
Object.defineProperty(exports, "isPassBid", { enumerable: true, get: function () { return bidding_1.isPassBid; } });
Object.defineProperty(exports, "isMarkBid", { enumerable: true, get: function () { return bidding_1.isMarkBid; } });
Object.defineProperty(exports, "getMinimumBidAmount", { enumerable: true, get: function () { return bidding_1.getMinimumBidAmount; } });
Object.defineProperty(exports, "BIDDING_CONSTANTS", { enumerable: true, get: function () { return bidding_1.BIDDING_CONSTANTS; } });
var game_state_1 = require("./game-state");
Object.defineProperty(exports, "createEmptyGameState", { enumerable: true, get: function () { return game_state_1.createEmptyGameState; } });
Object.defineProperty(exports, "createEmptyPartnershipState", { enumerable: true, get: function () { return game_state_1.createEmptyPartnershipState; } });
Object.defineProperty(exports, "createEmptyScoringState", { enumerable: true, get: function () { return game_state_1.createEmptyScoringState; } });
Object.defineProperty(exports, "createEmptyBiddingState", { enumerable: true, get: function () { return game_state_1.createEmptyBiddingState; } });
Object.defineProperty(exports, "createEmptyLobbyState", { enumerable: true, get: function () { return game_state_1.createEmptyLobbyState; } });
Object.defineProperty(exports, "GAME_CONSTANTS", { enumerable: true, get: function () { return game_state_1.GAME_CONSTANTS; } });
var validation_1 = require("./validation");
Object.defineProperty(exports, "ValidationSeverity", { enumerable: true, get: function () { return validation_1.ValidationSeverity; } });
Object.defineProperty(exports, "ValidationErrorType", { enumerable: true, get: function () { return validation_1.ValidationErrorType; } });
Object.defineProperty(exports, "createValidResult", { enumerable: true, get: function () { return validation_1.createValidResult; } });
Object.defineProperty(exports, "createInvalidResult", { enumerable: true, get: function () { return validation_1.createInvalidResult; } });
Object.defineProperty(exports, "createValidationError", { enumerable: true, get: function () { return validation_1.createValidationError; } });
Object.defineProperty(exports, "createValidationWarning", { enumerable: true, get: function () { return validation_1.createValidationWarning; } });
Object.defineProperty(exports, "combineValidationResults", { enumerable: true, get: function () { return validation_1.combineValidationResults; } });
Object.defineProperty(exports, "validateRequiredFields", { enumerable: true, get: function () { return validation_1.validateRequiredFields; } });
Object.defineProperty(exports, "validateFieldType", { enumerable: true, get: function () { return validation_1.validateFieldType; } });
Object.defineProperty(exports, "validateArrayLength", { enumerable: true, get: function () { return validation_1.validateArrayLength; } });
Object.defineProperty(exports, "validateNumericRange", { enumerable: true, get: function () { return validation_1.validateNumericRange; } });
Object.defineProperty(exports, "VALIDATION_CONSTANTS", { enumerable: true, get: function () { return validation_1.VALIDATION_CONSTANTS; } });
// ============================================================================
// Type Guards and Runtime Validation
// ============================================================================
var type_guards_1 = require("./type-guards");
Object.defineProperty(exports, "isValidDomino", { enumerable: true, get: function () { return type_guards_1.isValidDomino; } });
Object.defineProperty(exports, "isValidPlayer", { enumerable: true, get: function () { return type_guards_1.isValidPlayer; } });
Object.defineProperty(exports, "isValidGameState", { enumerable: true, get: function () { return type_guards_1.isValidGameState; } });
Object.defineProperty(exports, "isValidLobbyState", { enumerable: true, get: function () { return type_guards_1.isValidLobbyState; } });
Object.defineProperty(exports, "isValidBiddingState", { enumerable: true, get: function () { return type_guards_1.isValidBiddingState; } });
Object.defineProperty(exports, "isValidScoringState", { enumerable: true, get: function () { return type_guards_1.isValidScoringState; } });
Object.defineProperty(exports, "isValidTrick", { enumerable: true, get: function () { return type_guards_1.isValidTrick; } });
Object.defineProperty(exports, "isValidBid", { enumerable: true, get: function () { return type_guards_1.isValidBid; } });
Object.defineProperty(exports, "validatePlayerPosition", { enumerable: true, get: function () { return type_guards_1.validatePlayerPosition; } });
Object.defineProperty(exports, "validateGamePhase", { enumerable: true, get: function () { return type_guards_1.validateGamePhase; } });
Object.defineProperty(exports, "validateDominoSuit", { enumerable: true, get: function () { return type_guards_1.validateDominoSuit; } });
Object.defineProperty(exports, "createDomino", { enumerable: true, get: function () { return type_guards_1.createDomino; } });
var frontend_compat_1 = require("./frontend-compat");
Object.defineProperty(exports, "convertToLegacyGameState", { enumerable: true, get: function () { return frontend_compat_1.convertToLegacyGameState; } });
Object.defineProperty(exports, "convertFromLegacyGameState", { enumerable: true, get: function () { return frontend_compat_1.convertFromLegacyGameState; } });
Object.defineProperty(exports, "isValidLegacyGameState", { enumerable: true, get: function () { return frontend_compat_1.isValidLegacyGameState; } });
Object.defineProperty(exports, "createEmptyLegacyGameState", { enumerable: true, get: function () { return frontend_compat_1.createEmptyGameState; } });
Object.defineProperty(exports, "createCompatibleBid", { enumerable: true, get: function () { return frontend_compat_1.createCompatibleBid; } });
Object.defineProperty(exports, "createCompatiblePlayedDomino", { enumerable: true, get: function () { return frontend_compat_1.createCompatiblePlayedDomino; } });
Object.defineProperty(exports, "createCompatibleBiddingState", { enumerable: true, get: function () { return frontend_compat_1.createCompatibleBiddingState; } });
Object.defineProperty(exports, "createCompatibleTrick", { enumerable: true, get: function () { return frontend_compat_1.createCompatibleTrick; } });
// ============================================================================
// Package Information
// ============================================================================
/**
 * Package version and metadata
 */
exports.PACKAGE_INFO = {
    name: '@texas42/shared-types',
    version: '1.0.0',
    description: 'Shared TypeScript types for Texas 42 game frontend and backend',
    author: 'Texas 42 Development Team',
    license: 'MIT'
};
//# sourceMappingURL=index.js.map