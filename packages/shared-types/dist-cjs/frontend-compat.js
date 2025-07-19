"use strict";
/**
 * Frontend Compatibility Layer
 * Provides compatibility types and functions for migrating from frontend types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFullDominoSet = exports.createDomino = exports.isCountDomino = exports.calculateDominoPointValue = exports.createEmptyScoringState = exports.createEmptyBiddingState = exports.createEmptyLobbyState = exports.validateDominoSuit = exports.validateGamePhase = exports.validatePlayerPosition = exports.isValidLobbyState = exports.isValidScoringState = exports.isValidBiddingState = exports.isValidTrick = exports.isValidBid = exports.isValidPlayer = void 0;
exports.convertToLegacyGameState = convertToLegacyGameState;
exports.convertFromLegacyGameState = convertFromLegacyGameState;
exports.isValidLegacyGameState = isValidLegacyGameState;
exports.createEmptyGameState = createEmptyGameState;
exports.createCompatibleBid = createCompatibleBid;
exports.createCompatiblePlayedDomino = createCompatiblePlayedDomino;
exports.createCompatibleBiddingState = createCompatibleBiddingState;
exports.createCompatibleTrick = createCompatibleTrick;
const type_guards_1 = require("./type-guards");
/**
 * Convert shared GameState to legacy format for frontend compatibility
 */
function convertToLegacyGameState(sharedState) {
    return {
        id: sharedState.id,
        phase: sharedState.phase,
        players: sharedState.players,
        currentPlayer: sharedState.currentPlayer,
        dealer: sharedState.dealer,
        bidder: sharedState.currentBid?.playerId,
        currentBid: sharedState.currentBid,
        trump: sharedState.trump,
        tricks: sharedState.tricks,
        currentTrick: sharedState.currentTrick,
        scores: {
            northSouth: sharedState.partnerships.northSouth.currentHandScore,
            eastWest: sharedState.partnerships.eastWest.currentHandScore
        },
        gameScore: sharedState.gameScore,
        boneyard: sharedState.boneyard,
        biddingState: sharedState.biddingState,
        scoringState: sharedState.scoringState,
        partnershipState: sharedState.partnerships,
        createdAt: sharedState.createdAt,
        updatedAt: sharedState.updatedAt
    };
}
/**
 * Convert legacy GameState to shared format
 */
function convertFromLegacyGameState(legacyState) {
    return {
        id: legacyState.id,
        phase: legacyState.phase,
        players: legacyState.players,
        partnerships: legacyState.partnershipState || {
            northSouth: {
                players: ['', ''],
                currentHandScore: legacyState.scores.northSouth,
                marks: 0,
                totalGameScore: legacyState.gameScore.northSouth,
                tricksWon: 0,
                isBiddingTeam: false
            },
            eastWest: {
                players: ['', ''],
                currentHandScore: legacyState.scores.eastWest,
                marks: 0,
                totalGameScore: legacyState.gameScore.eastWest,
                tricksWon: 0,
                isBiddingTeam: false
            }
        },
        handNumber: 1,
        dealer: legacyState.dealer,
        currentPlayer: legacyState.currentPlayer,
        biddingState: legacyState.biddingState || {
            bidHistory: [],
            biddingComplete: false,
            passCount: 0,
            minimumBid: 30,
            forcedBidActive: false
        },
        currentBid: legacyState.currentBid,
        trump: legacyState.trump,
        tricks: legacyState.tricks,
        currentTrick: legacyState.currentTrick,
        boneyard: legacyState.boneyard,
        scoringState: legacyState.scoringState || {
            trickPoints: 0,
            countDominoes: [],
            bonusPoints: 0,
            penaltyPoints: 0,
            roundComplete: false
        },
        handScores: [],
        marks: {
            northSouth: legacyState.partnershipState?.northSouth.marks || 0,
            eastWest: legacyState.partnershipState?.eastWest.marks || 0
        },
        gameScore: legacyState.gameScore,
        marksToWin: 7,
        gameComplete: false,
        createdAt: legacyState.createdAt,
        updatedAt: legacyState.updatedAt,
        isValid: true,
        validationErrors: []
    };
}
/**
 * Legacy validation function for GameState
 */
function isValidLegacyGameState(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { id, phase, players, dealer, tricks, scores, gameScore, boneyard, createdAt, updatedAt } = obj;
    // Check required fields
    if (typeof id !== 'string' || id.length === 0)
        return false;
    if (!['bidding', 'playing', 'scoring', 'finished'].includes(phase))
        return false;
    if (!Array.isArray(players))
        return false;
    if (typeof dealer !== 'string' || dealer.length === 0)
        return false;
    if (!Array.isArray(tricks))
        return false;
    if (!Array.isArray(boneyard))
        return false;
    if (typeof createdAt !== 'string')
        return false;
    if (typeof updatedAt !== 'string')
        return false;
    // Validate players (must be exactly 4 for Texas 42)
    if (players.length !== 4)
        return false;
    if (!players.every(player => (0, type_guards_1.isValidPlayer)(player)))
        return false;
    // Check for unique positions (no duplicates)
    const positions = players.map((p) => p.position);
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== 4)
        return false;
    // Check that dealer is one of the player IDs
    const playerIds = players.map((p) => p.id);
    if (!playerIds.includes(dealer))
        return false;
    // Validate scores
    if (!scores || typeof scores !== 'object')
        return false;
    const scoresObj = scores;
    if (typeof scoresObj.northSouth !== 'number' || typeof scoresObj.eastWest !== 'number')
        return false;
    if (!gameScore || typeof gameScore !== 'object')
        return false;
    const gameScoreObj = gameScore;
    if (typeof gameScoreObj.northSouth !== 'number' || typeof gameScoreObj.eastWest !== 'number')
        return false;
    return true;
}
/**
 * Factory function to create empty legacy game state
 */
function createEmptyGameState(gameId) {
    const now = new Date().toISOString();
    return {
        id: gameId,
        phase: 'bidding',
        players: [],
        dealer: '',
        tricks: [],
        scores: { northSouth: 0, eastWest: 0 },
        gameScore: { northSouth: 0, eastWest: 0 },
        boneyard: [],
        createdAt: now,
        updatedAt: now
    };
}
// Re-export validation functions
var type_guards_2 = require("./type-guards");
Object.defineProperty(exports, "isValidPlayer", { enumerable: true, get: function () { return type_guards_2.isValidPlayer; } });
Object.defineProperty(exports, "isValidBid", { enumerable: true, get: function () { return type_guards_2.isValidBid; } });
Object.defineProperty(exports, "isValidTrick", { enumerable: true, get: function () { return type_guards_2.isValidTrick; } });
Object.defineProperty(exports, "isValidBiddingState", { enumerable: true, get: function () { return type_guards_2.isValidBiddingState; } });
Object.defineProperty(exports, "isValidScoringState", { enumerable: true, get: function () { return type_guards_2.isValidScoringState; } });
Object.defineProperty(exports, "isValidLobbyState", { enumerable: true, get: function () { return type_guards_2.isValidLobbyState; } });
Object.defineProperty(exports, "validatePlayerPosition", { enumerable: true, get: function () { return type_guards_2.validatePlayerPosition; } });
Object.defineProperty(exports, "validateGamePhase", { enumerable: true, get: function () { return type_guards_2.validateGamePhase; } });
Object.defineProperty(exports, "validateDominoSuit", { enumerable: true, get: function () { return type_guards_2.validateDominoSuit; } });
// Re-export factory functions
var game_state_1 = require("./game-state");
Object.defineProperty(exports, "createEmptyLobbyState", { enumerable: true, get: function () { return game_state_1.createEmptyLobbyState; } });
Object.defineProperty(exports, "createEmptyBiddingState", { enumerable: true, get: function () { return game_state_1.createEmptyBiddingState; } });
Object.defineProperty(exports, "createEmptyScoringState", { enumerable: true, get: function () { return game_state_1.createEmptyScoringState; } });
// Re-export domino functions
var dominoes_1 = require("./dominoes");
Object.defineProperty(exports, "calculateDominoPointValue", { enumerable: true, get: function () { return dominoes_1.calculateDominoPointValue; } });
Object.defineProperty(exports, "isCountDomino", { enumerable: true, get: function () { return dominoes_1.isCountDomino; } });
Object.defineProperty(exports, "createDomino", { enumerable: true, get: function () { return dominoes_1.createDomino; } });
Object.defineProperty(exports, "createFullDominoSet", { enumerable: true, get: function () { return dominoes_1.createFullDominoSet; } });
// ============================================================================
// Helper Functions for Frontend Compatibility
// ============================================================================
/**
 * Create a compatible Bid object for frontend use
 */
function createCompatibleBid(playerId, amount, trump) {
    return {
        playerId,
        amount,
        trump,
        isSpecialContract: false,
        timestamp: new Date().toISOString()
    };
}
/**
 * Create a compatible PlayedDomino object for frontend use
 */
function createCompatiblePlayedDomino(domino, playerId, position, playOrder = 0) {
    return {
        domino,
        playerId,
        position,
        playOrder,
        timestamp: new Date().toISOString()
    };
}
/**
 * Create a compatible BiddingState object for frontend use
 */
function createCompatibleBiddingState(overrides = {}) {
    return {
        bidHistory: [],
        biddingComplete: false,
        passCount: 0,
        minimumBid: 30,
        forcedBidActive: false,
        ...overrides
    };
}
/**
 * Create a compatible Trick object for frontend use
 */
function createCompatibleTrick(id, dominoes = [], trickNumber = 1, overrides = {}) {
    const pointValue = dominoes.reduce((sum, played) => sum + played.domino.pointValue, 0);
    const countDominoes = dominoes
        .filter(played => played.domino.isCountDomino)
        .map(played => played.domino);
    return {
        id,
        dominoes,
        pointValue,
        countDominoes,
        trickNumber,
        isComplete: dominoes.length === 4,
        ...overrides
    };
}
//# sourceMappingURL=frontend-compat.js.map