/**
 * Texas 42 Bidding Validation Functions
 * Functions for validating bids and special contracts
 */
import { Bid, BidValidationResult, SpecialContractType } from './bidding-types';
/**
 * Validate a bid
 *
 * @param bid The bid to validate
 * @param currentHighBid Current highest bid (if any)
 * @param biddingComplete Whether bidding is complete
 * @returns Validation result
 */
export declare function validateBid(bid: Bid, currentHighBid?: Bid, biddingComplete?: boolean): BidValidationResult;
/**
 * Validate a special contract bid
 *
 * @param contractType Type of special contract
 * @param bid The bid object
 * @returns Validation result
 */
export declare function validateSpecialContract(contractType: SpecialContractType, bid: Bid): BidValidationResult;
//# sourceMappingURL=bidding-validation.d.ts.map