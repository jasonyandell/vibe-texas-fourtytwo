"use strict";
/**
 * Texas 42 Bidding System Types
 * Enhanced bidding types with special contracts and mark system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIDDING_CONSTANTS = exports.BiddingValidationError = void 0;
exports.createPassBid = createPassBid;
exports.createRegularBid = createRegularBid;
exports.createMarkBid = createMarkBid;
exports.createSpecialContractBid = createSpecialContractBid;
exports.getSpecialContractAmount = getSpecialContractAmount;
exports.convertBidToMarks = convertBidToMarks;
exports.convertMarksToBid = convertMarksToBid;
exports.validateBid = validateBid;
exports.validateSpecialContract = validateSpecialContract;
exports.isPassBid = isPassBid;
exports.isMarkBid = isMarkBid;
exports.getMinimumBidAmount = getMinimumBidAmount;
/**
 * Bidding validation errors
 * Enumeration of possible bid validation failures
 */
var BiddingValidationError;
(function (BiddingValidationError) {
    BiddingValidationError["BID_TOO_LOW"] = "BID_TOO_LOW";
    BiddingValidationError["BID_TOO_HIGH"] = "BID_TOO_HIGH";
    BiddingValidationError["BID_NOT_HIGHER"] = "BID_NOT_HIGHER";
    BiddingValidationError["NOT_CURRENT_BIDDER"] = "NOT_CURRENT_BIDDER";
    BiddingValidationError["INVALID_TRUMP_SUIT"] = "INVALID_TRUMP_SUIT";
    BiddingValidationError["BIDDING_COMPLETE"] = "BIDDING_COMPLETE";
    BiddingValidationError["MISSING_TRUMP"] = "MISSING_TRUMP";
    BiddingValidationError["INVALID_SPECIAL_CONTRACT"] = "INVALID_SPECIAL_CONTRACT";
    BiddingValidationError["INSUFFICIENT_DOUBLES_FOR_PLUNGE"] = "INSUFFICIENT_DOUBLES_FOR_PLUNGE";
    BiddingValidationError["INVALID_MARK_BID"] = "INVALID_MARK_BID";
})(BiddingValidationError || (exports.BiddingValidationError = BiddingValidationError = {}));
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
/**
 * Convert bid amount to marks
 *
 * @param amount Bid amount
 * @returns Number of marks (1 mark = 42 points)
 */
function convertBidToMarks(amount) {
    if (amount < 42)
        return 0;
    return Math.floor(amount / 42);
}
/**
 * Convert marks to bid amount
 *
 * @param marks Number of marks
 * @returns Bid amount (marks * 42)
 */
function convertMarksToBid(marks) {
    return marks * 42;
}
/**
 * Validate a bid
 *
 * @param bid The bid to validate
 * @param currentHighBid Current highest bid (if any)
 * @param biddingComplete Whether bidding is complete
 * @returns Validation result
 */
function validateBid(bid, currentHighBid, biddingComplete) {
    // Check if bidding is complete
    if (biddingComplete) {
        return {
            isValid: false,
            error: 'Bidding phase is already complete'
        };
    }
    // Check if it's a pass bid
    if (bid.amount === 0) {
        return { isValid: true };
    }
    // Validate bid amount range
    if (bid.amount < 30 || bid.amount > 252) { // Max is 6 marks (6 * 42)
        return {
            isValid: false,
            error: 'Bid amount must be between 30-252 or 0 (pass)'
        };
    }
    // Check if bid is higher than current bid
    if (currentHighBid && currentHighBid.amount > 0 && bid.amount <= currentHighBid.amount) {
        return {
            isValid: false,
            error: 'Bid must be higher than current bid'
        };
    }
    // Non-pass bids must have trump (except special contracts)
    if (!bid.isSpecialContract && !bid.trump) {
        return {
            isValid: false,
            error: 'Must select trump suit for regular bids'
        };
    }
    // Validate special contracts
    if (bid.isSpecialContract && bid.contractType) {
        const contractValidation = validateSpecialContract(bid.contractType, bid);
        if (!contractValidation.isValid) {
            return contractValidation;
        }
    }
    return { isValid: true };
}
/**
 * Validate a special contract bid
 *
 * @param contractType Type of special contract
 * @param bid The bid object
 * @returns Validation result
 */
function validateSpecialContract(contractType, bid) {
    switch (contractType) {
        case 'nello':
            // Nello can be bid by any player
            return { isValid: true };
        case 'plunge':
            // Plunge requires minimum 4 marks
            if (bid.amount < 168) {
                return {
                    isValid: false,
                    error: 'Plunge requires minimum 4 marks (168 points)'
                };
            }
            return { isValid: true };
        case 'sevens':
            // Sevens can be bid by any player
            return { isValid: true };
        case 'follow-me':
            // Follow Me (no trump) can be bid by any player
            if (!bid.doublesOption) {
                return {
                    isValid: false,
                    error: 'Follow Me requires doubles option (high or low)'
                };
            }
            return { isValid: true };
        default:
            return {
                isValid: false,
                error: `Unknown special contract type: ${contractType}`
            };
    }
}
/**
 * Check if a bid is a pass
 *
 * @param bid The bid to check
 * @returns True if the bid is a pass
 */
function isPassBid(bid) {
    return bid.amount === 0;
}
/**
 * Check if a bid is a mark bid
 *
 * @param bid The bid to check
 * @returns True if the bid is for marks (42+ points)
 */
function isMarkBid(bid) {
    return bid.amount >= 42 || (bid.marks !== undefined && bid.marks > 0);
}
/**
 * Get the minimum valid bid amount
 *
 * @param currentHighBid Current highest bid (if any)
 * @returns Minimum valid bid amount
 */
function getMinimumBidAmount(currentHighBid) {
    if (!currentHighBid || currentHighBid.amount === 0) {
        return 30; // Minimum opening bid
    }
    return currentHighBid.amount + 1;
}
/**
 * Constants for the bidding system
 */
exports.BIDDING_CONSTANTS = {
    /** Minimum bid amount */
    MIN_BID: 30,
    /** Maximum regular bid amount */
    MAX_REGULAR_BID: 41,
    /** Points per mark */
    POINTS_PER_MARK: 42,
    /** Maximum marks that can be bid */
    MAX_MARKS: 6,
    /** Maximum total bid amount */
    MAX_BID: 252, // 6 marks * 42 points
    /** Number of passes needed to end bidding */
    PASSES_TO_END: 3,
    /** All special contract types */
    SPECIAL_CONTRACTS: ['nello', 'plunge', 'sevens', 'follow-me']
};
//# sourceMappingURL=bidding.js.map