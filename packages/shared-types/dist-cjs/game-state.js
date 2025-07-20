"use strict";
/**
 * Texas 42 Game State Types
 * Enhanced game state with complete rule compliance and marks system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyGameState = createEmptyGameState;
const partnership_1 = require("./partnership");
const scoring_1 = require("./scoring");
const bidding_state_1 = require("./bidding-state");
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
        partnerships: (0, partnership_1.createEmptyPartnershipState)(),
        handNumber: 1,
        dealer: '',
        biddingState: (0, bidding_state_1.createEmptyBiddingState)(),
        tricks: [],
        boneyard: [],
        scoringState: (0, scoring_1.createEmptyScoringState)(),
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
//# sourceMappingURL=game-state.js.map