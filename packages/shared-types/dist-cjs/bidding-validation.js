"use strict";
/**
 * Texas 42 Bidding Validation Functions
 * Functions for validating bids and special contracts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBid = validateBid;
exports.validateSpecialContract = validateSpecialContract;
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
//# sourceMappingURL=bidding-validation.js.map