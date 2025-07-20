"use strict";
/**
 * Texas 42 Bidding System Types
 * Core type definitions for the bidding system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiddingValidationError = void 0;
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
//# sourceMappingURL=bidding-types.js.map