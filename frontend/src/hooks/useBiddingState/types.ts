import { DominoSuit } from '@/types/texas42';
import { Bid } from '@texas42/shared-types';
import { ExtendedBiddingState } from '@/utils/biddingValidation';

export interface BiddingActions {
  placeBid: (amount: number, trump: DominoSuit) => { success: boolean; error?: string };
  passBid: () => { success: boolean; error?: string };
  validateBidInput: (amount: number, trump: DominoSuit) => { isValid: boolean; error?: string };
  getMinimumBidAmount: () => number;
  canCurrentPlayerBid: () => boolean;
  isBiddingComplete: () => boolean;
  getCurrentBidder: () => string | undefined;
  getHighestBid: () => Bid | null;
  getBidHistory: () => Bid[];
}

export interface BiddingStateHook {
  biddingState: ExtendedBiddingState;
  actions: BiddingActions;
  isLoading: boolean;
  error: string | null;
}