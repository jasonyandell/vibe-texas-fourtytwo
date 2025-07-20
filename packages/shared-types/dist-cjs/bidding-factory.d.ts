/**
 * Texas 42 Bidding Factory Functions
 * Functions for creating different types of bids
 */
import { DominoSuit } from './trump';
import { Bid, SpecialContractType } from './bidding-types';
/**
 * Create a pass bid
 *
 * @param playerId Player making the pass
 * @returns Pass bid object
 */
export declare function createPassBid(playerId: string): Bid;
/**
 * Create a regular point bid
 *
 * @param playerId Player making the bid
 * @param amount Bid amount (30-41)
 * @param trump Trump suit
 * @returns Regular bid object
 */
export declare function createRegularBid(playerId: string, amount: number, trump: DominoSuit): Bid;
/**
 * Create a mark bid
 *
 * @param playerId Player making the bid
 * @param marks Number of marks (1+ marks)
 * @param trump Trump suit
 * @returns Mark bid object
 */
export declare function createMarkBid(playerId: string, marks: number, trump: DominoSuit): Bid;
/**
 * Create a special contract bid
 *
 * @param playerId Player making the bid
 * @param contractType Type of special contract
 * @param doublesOption For no-trump contracts
 * @returns Special contract bid object
 */
export declare function createSpecialContractBid(playerId: string, contractType: SpecialContractType, doublesOption?: 'high' | 'low'): Bid;
/**
 * Get the bid amount for a special contract
 *
 * @param contractType Type of special contract
 * @returns Bid amount for the contract
 */
export declare function getSpecialContractAmount(contractType: SpecialContractType): number;
//# sourceMappingURL=bidding-factory.d.ts.map