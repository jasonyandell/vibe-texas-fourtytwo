"use strict";
/**
 * Texas 42 Partnership Types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyPartnershipState = createEmptyPartnershipState;
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
//# sourceMappingURL=partnership.js.map