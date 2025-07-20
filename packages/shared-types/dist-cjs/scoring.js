"use strict";
/**
 * Texas 42 Scoring Types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyScoringState = createEmptyScoringState;
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
//# sourceMappingURL=scoring.js.map