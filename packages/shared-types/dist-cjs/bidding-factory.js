"use strict";
/**
 * Texas 42 Bidding Factory Functions
 * Functions for creating different types of bids
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPassBid = createPassBid;
exports.createRegularBid = createRegularBid;
exports.createMarkBid = createMarkBid;
exports.createSpecialContractBid = createSpecialContractBid;
exports.getSpecialContractAmount = getSpecialContractAmount;
/**
 * Create a pass bid
 *
 * @param playerId Player making the pass
 * @returns Pass bid object
 */
function createPassBid(playerId) {
    return {
        playerId,
        amount: 0,
        isSpecialContract: false,
        timestamp: new Date().toISOString()
    };
}
/**
 * Create a regular point bid
 *
 * @param playerId Player making the bid
 * @param amount Bid amount (30-41)
 * @param trump Trump suit
 * @returns Regular bid object
 */
function createRegularBid(playerId, amount, trump) {
    return {
        playerId,
        amount,
        trump,
        isSpecialContract: false,
        timestamp: new Date().toISOString()
    };
}
/**
 * Create a mark bid
 *
 * @param playerId Player making the bid
 * @param marks Number of marks (1+ marks)
 * @param trump Trump suit
 * @returns Mark bid object
 */
function createMarkBid(playerId, marks, trump) {
    return {
        playerId,
        amount: marks * 42, // 1 mark = 42 points
        marks,
        trump,
        isSpecialContract: false,
        timestamp: new Date().toISOString()
    };
}
/**
 * Create a special contract bid
 *
 * @param playerId Player making the bid
 * @param contractType Type of special contract
 * @param doublesOption For no-trump contracts
 * @returns Special contract bid object
 */
function createSpecialContractBid(playerId, contractType, doublesOption) {
    return {
        playerId,
        amount: getSpecialContractAmount(contractType),
        isSpecialContract: true,
        contractType,
        doublesOption,
        timestamp: new Date().toISOString()
    };
}
/**
 * Get the bid amount for a special contract
 *
 * @param contractType Type of special contract
 * @returns Bid amount for the contract
 */
function getSpecialContractAmount(contractType) {
    switch (contractType) {
        case 'nello': return 42; // 1 mark
        case 'plunge': return 168; // 4 marks minimum
        case 'sevens': return 42; // 1 mark
        case 'follow-me': return 42; // 1 mark
        default: return 42;
    }
}
//# sourceMappingURL=bidding-factory.js.map