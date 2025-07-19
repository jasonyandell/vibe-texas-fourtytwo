"use strict";
/**
 * Type Guards and Validation Functions
 * Runtime type validation for Texas 42 game types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyScoringState = exports.createEmptyBiddingState = exports.createEmptyLobbyState = exports.createEmptyGameState = exports.createDomino = exports.isValidDomino = void 0;
exports.isValidPlayer = isValidPlayer;
exports.isValidBid = isValidBid;
exports.isValidTrick = isValidTrick;
exports.isValidBiddingState = isValidBiddingState;
exports.isValidScoringState = isValidScoringState;
exports.isValidGameState = isValidGameState;
exports.isValidLobbyState = isValidLobbyState;
exports.validatePlayerPosition = validatePlayerPosition;
exports.validateGamePhase = validateGamePhase;
exports.validateDominoSuit = validateDominoSuit;
const dominoes_1 = require("./dominoes");
const game_state_1 = require("./game-state");
Object.defineProperty(exports, "createEmptyGameState", { enumerable: true, get: function () { return game_state_1.createEmptyGameState; } });
Object.defineProperty(exports, "createEmptyLobbyState", { enumerable: true, get: function () { return game_state_1.createEmptyLobbyState; } });
Object.defineProperty(exports, "createEmptyBiddingState", { enumerable: true, get: function () { return game_state_1.createEmptyBiddingState; } });
Object.defineProperty(exports, "createEmptyScoringState", { enumerable: true, get: function () { return game_state_1.createEmptyScoringState; } });
// Re-export domino validation and creation
var dominoes_2 = require("./dominoes");
Object.defineProperty(exports, "isValidDomino", { enumerable: true, get: function () { return dominoes_2.isValidDomino; } });
Object.defineProperty(exports, "createDomino", { enumerable: true, get: function () { return dominoes_2.createDomino; } });
/**
 * Validates if a value is a valid player
 */
function isValidPlayer(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { id, name, position, hand, isConnected, isReady } = obj;
    // Check required fields
    if (typeof id !== 'string' || id.length === 0)
        return false;
    if (typeof name !== 'string' || name.length === 0)
        return false;
    if (!validatePlayerPosition(position))
        return false;
    if (!Array.isArray(hand))
        return false;
    if (typeof isConnected !== 'boolean')
        return false;
    if (typeof isReady !== 'boolean')
        return false;
    // Validate all dominoes in hand
    if (!hand.every(domino => (0, dominoes_1.isValidDomino)(domino)))
        return false;
    return true;
}
/**
 * Validates if a value is a valid bid
 */
function isValidBid(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { playerId, amount, trump } = obj;
    // Check required fields
    if (typeof playerId !== 'string' || playerId.length === 0)
        return false;
    if (typeof amount !== 'number')
        return false;
    // Pass bid (amount = 0)
    if (amount === 0) {
        // Pass bids should not have trump
        return trump === undefined;
    }
    // Regular bid validation
    if (amount < 30 || amount > 42)
        return false;
    // Non-pass bids must have trump
    if (!trump || !validateDominoSuit(trump))
        return false;
    return true;
}
/**
 * Validates if a value is a valid trick
 */
function isValidTrick(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { id, dominoes, winner, leadSuit } = obj;
    // Check required fields
    if (typeof id !== 'string' || id.length === 0)
        return false;
    if (!Array.isArray(dominoes))
        return false;
    // Check dominoes count (1-4 for Texas 42)
    if (dominoes.length === 0 || dominoes.length > 4)
        return false;
    // Validate each domino play
    for (const play of dominoes) {
        if (!play || typeof play !== 'object')
            return false;
        const playObj = play;
        if (!(0, dominoes_1.isValidDomino)(playObj.domino))
            return false;
        if (typeof playObj.playerId !== 'string' || playObj.playerId.length === 0)
            return false;
        if (!validatePlayerPosition(playObj.position))
            return false;
    }
    // Optional fields validation
    if (winner !== undefined && (typeof winner !== 'string' || winner.length === 0))
        return false;
    if (leadSuit !== undefined && !validateDominoSuit(leadSuit))
        return false;
    return true;
}
/**
 * Validates if a value is a valid bidding state
 */
function isValidBiddingState(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { bidHistory, biddingComplete, passCount, minimumBid, currentBidder, currentBid } = obj;
    // Check required fields
    if (!Array.isArray(bidHistory))
        return false;
    if (typeof biddingComplete !== 'boolean')
        return false;
    if (typeof passCount !== 'number' || passCount < 0)
        return false;
    if (typeof minimumBid !== 'number' || minimumBid < 30)
        return false;
    // Validate bid history
    if (!bidHistory.every((bid) => isValidBid(bid)))
        return false;
    // Optional fields
    if (currentBidder !== undefined && typeof currentBidder !== 'string')
        return false;
    if (currentBid !== undefined && !isValidBid(currentBid))
        return false;
    return true;
}
/**
 * Validates if a value is a valid scoring state
 */
function isValidScoringState(value) {
    if (!value || typeof value !== 'object')
        return false;
    const { trickPoints, countDominoes, bonusPoints, penaltyPoints, roundComplete, currentTrickWinner } = value;
    // Check required fields
    if (typeof trickPoints !== 'number' || trickPoints < 0)
        return false;
    if (!Array.isArray(countDominoes))
        return false;
    if (typeof bonusPoints !== 'number')
        return false;
    if (typeof penaltyPoints !== 'number')
        return false;
    if (typeof roundComplete !== 'boolean')
        return false;
    // Validate count dominoes
    if (!countDominoes.every((domino) => (0, dominoes_1.isValidDomino)(domino)))
        return false;
    // Optional fields
    if (currentTrickWinner !== undefined && typeof currentTrickWinner !== 'string')
        return false;
    return true;
}
/**
 * Validates if a value is a valid game state
 */
function isValidGameState(value) {
    // This is a simplified validation - the actual GameState in shared types
    // has a different structure than the frontend version
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { id, phase, players, dealer } = obj;
    // Check basic required fields
    if (typeof id !== 'string' || id.length === 0)
        return false;
    if (!validateGamePhase(phase))
        return false;
    if (!Array.isArray(players))
        return false;
    if (typeof dealer !== 'string' || dealer.length === 0)
        return false;
    // Validate players (must be exactly 4 for Texas 42)
    if (players.length !== 4)
        return false;
    if (!players.every(player => isValidPlayer(player)))
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
    return true;
}
/**
 * Validates if a value is a valid lobby state
 */
function isValidLobbyState(value) {
    if (!value || typeof value !== 'object')
        return false;
    const { availableGames, connectedPlayers } = value;
    // Check required fields
    if (!Array.isArray(availableGames))
        return false;
    if (typeof connectedPlayers !== 'number' || connectedPlayers < 0)
        return false;
    // Validate each game in the lobby
    for (const game of availableGames) {
        if (!game || typeof game !== 'object')
            return false;
        const gameObj = game;
        const { id, name, playerCount, maxPlayers, status, createdAt } = gameObj;
        if (typeof id !== 'string' || id.length === 0)
            return false;
        if (typeof name !== 'string' || name.length === 0)
            return false;
        if (typeof playerCount !== 'number' || playerCount < 0)
            return false;
        if (typeof maxPlayers !== 'number' || maxPlayers < 1)
            return false;
        if (playerCount > maxPlayers)
            return false;
        if (!['waiting', 'playing', 'finished'].includes(status))
            return false;
        if (typeof createdAt !== 'string')
            return false;
    }
    return true;
}
/**
 * Validates player position enum
 */
function validatePlayerPosition(value) {
    return typeof value === 'string' && ['north', 'east', 'south', 'west'].includes(value);
}
/**
 * Validates game phase enum
 */
function validateGamePhase(value) {
    return typeof value === 'string' && ['bidding', 'playing', 'scoring', 'finished'].includes(value);
}
/**
 * Validates domino suit enum
 */
function validateDominoSuit(value) {
    return typeof value === 'string' &&
        ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(value);
}
//# sourceMappingURL=type-guards.js.map