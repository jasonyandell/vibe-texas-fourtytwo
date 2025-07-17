"use strict";
/**
 * Texas 42 Game State Types
 * Enhanced game state with complete rule compliance and marks system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_CONSTANTS = void 0;
exports.createEmptyGameState = createEmptyGameState;
exports.createEmptyPartnershipState = createEmptyPartnershipState;
exports.createEmptyScoringState = createEmptyScoringState;
exports.createEmptyBiddingState = createEmptyBiddingState;
exports.createEmptyLobbyState = createEmptyLobbyState;
/**
 * Create an empty game state
 *
 * @param gameId Game identifier
 * @returns Empty game state with default values
 */
function createEmptyGameState(gameId) {
    const now = new Date().toISOString();
    return {
        id: gameId,
        phase: 'bidding',
        players: [],
        partnerships: createEmptyPartnershipState(),
        handNumber: 1,
        dealer: '',
        biddingState: createEmptyBiddingState(),
        tricks: [],
        boneyard: [],
        scoringState: createEmptyScoringState(),
        handScores: [],
        marks: { northSouth: 0, eastWest: 0 },
        gameScore: { northSouth: 0, eastWest: 0 },
        marksToWin: 7,
        gameComplete: false,
        createdAt: now,
        updatedAt: now,
        isValid: true,
        validationErrors: []
    };
}
/**
 * Create empty partnership state
 *
 * @returns Empty partnership state
 */
function createEmptyPartnershipState() {
    return {
        northSouth: {
            players: ['', ''],
            currentHandScore: 0,
            marks: 0,
            totalGameScore: 0,
            tricksWon: 0,
            isBiddingTeam: false
        },
        eastWest: {
            players: ['', ''],
            currentHandScore: 0,
            marks: 0,
            totalGameScore: 0,
            tricksWon: 0,
            isBiddingTeam: false
        }
    };
}
/**
 * Create empty scoring state
 *
 * @returns Empty scoring state
 */
function createEmptyScoringState() {
    return {
        trickPoints: 0,
        countDominoes: [],
        bonusPoints: 0,
        penaltyPoints: 0,
        roundComplete: false
    };
}
/**
 * Create empty bidding state
 *
 * @returns Empty bidding state
 */
function createEmptyBiddingState() {
    return {
        bidHistory: [],
        biddingComplete: false,
        passCount: 0,
        minimumBid: 30,
        forcedBidActive: false
    };
}
/**
 * Create empty lobby state
 *
 * @returns Empty lobby state
 */
function createEmptyLobbyState() {
    return {
        availableGames: [],
        connectedPlayers: 0
    };
}
/**
 * Constants for game state management
 */
exports.GAME_CONSTANTS = {
    /** Maximum players in a Texas 42 game */
    MAX_PLAYERS: 4,
    /** Number of tricks per hand */
    TRICKS_PER_HAND: 7,
    /** Default marks to win */
    DEFAULT_MARKS_TO_WIN: 7,
    /** Default points to win (for point-based games) */
    DEFAULT_POINTS_TO_WIN: 250,
    /** All player positions */
    PLAYER_POSITIONS: ['north', 'east', 'south', 'west'],
    /** All partnership teams */
    PARTNERSHIP_TEAMS: ['northSouth', 'eastWest'],
    /** All game phases */
    GAME_PHASES: ['bidding', 'playing', 'scoring', 'finished']
};
//# sourceMappingURL=game-state.js.map