import { DominoSuit, Bid, Player } from '@/types/texas42';

// Extended bidding state for validation (matches the existing interface but with additional fields)
export interface ExtendedBiddingState {
  currentBidder?: string;
  currentBid?: Bid;
  bidHistory: Bid[];
  biddingComplete: boolean;
  passCount: number;
  minimumBid: number;
  // Additional fields for validation
  bids: Bid[];
  passes: string[];
  highestBid: Bid | null;
  isComplete: boolean;
  winner: string | null;
}

export enum BiddingValidationError {
  BID_TOO_LOW = 'BID_TOO_LOW',
  BID_TOO_HIGH = 'BID_TOO_HIGH',
  BID_NOT_HIGHER = 'BID_NOT_HIGHER',
  NOT_CURRENT_BIDDER = 'NOT_CURRENT_BIDDER',
  INVALID_TRUMP_SUIT = 'INVALID_TRUMP_SUIT',
  BIDDING_COMPLETE = 'BIDDING_COMPLETE'
}

export interface BidValidationResult {
  isValid: boolean;
  error?: BiddingValidationError;
  message?: string;
}

/**
 * Validates a bid attempt
 */
export function validateBid(
  amount: number,
  trump: DominoSuit,
  biddingState: ExtendedBiddingState,
  playerId: string
): BidValidationResult {
  // Check if bidding is complete
  if (biddingState.isComplete) {
    return {
      isValid: false,
      error: BiddingValidationError.BIDDING_COMPLETE,
      message: 'Bidding has already ended'
    };
  }

  // Check if it's the player's turn to bid
  if (biddingState.currentBidder !== playerId) {
    return {
      isValid: false,
      error: BiddingValidationError.NOT_CURRENT_BIDDER,
      message: 'It is not your turn to bid'
    };
  }

  // Validate bid amount range
  if (!isValidBidAmount(amount)) {
    if (amount < 30) {
      return {
        isValid: false,
        error: BiddingValidationError.BID_TOO_LOW,
        message: 'Bid must be at least 30'
      };
    } else {
      return {
        isValid: false,
        error: BiddingValidationError.BID_TOO_HIGH,
        message: 'Bid cannot exceed 42'
      };
    }
  }

  // Validate trump suit
  if (!isValidTrumpSuit(trump)) {
    return {
      isValid: false,
      error: BiddingValidationError.INVALID_TRUMP_SUIT,
      message: 'Invalid trump suit selected'
    };
  }

  // Check if bid is higher than current highest bid
  const minimumBid = getMinimumBid(biddingState);
  if (amount < minimumBid) {
    return {
      isValid: false,
      error: BiddingValidationError.BID_NOT_HIGHER,
      message: `Bid must be at least ${minimumBid}`
    };
  }

  return {
    isValid: true
  };
}

/**
 * Checks if a bid amount is within valid range (30-42)
 */
export function isValidBidAmount(amount: number): boolean {
  return amount >= 30 && amount <= 42;
}

/**
 * Checks if a trump suit is valid
 */
export function isValidTrumpSuit(trump: DominoSuit): boolean {
  const validSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return validSuits.includes(trump);
}

/**
 * Gets the minimum valid bid amount
 */
export function getMinimumBid(biddingState: ExtendedBiddingState): number {
  if (!biddingState.highestBid) {
    return 30; // Minimum starting bid
  }
  return biddingState.highestBid.amount + 1;
}

/**
 * Checks if a player can currently bid
 */
export function canPlayerBid(playerId: string, biddingState: ExtendedBiddingState): boolean {
  return !biddingState.isComplete && biddingState.currentBidder === playerId;
}

/**
 * Determines if bidding should end
 */
export function shouldEndBidding(biddingState: ExtendedBiddingState, players: Player[]): boolean {
  const totalPlayers = players.length;
  
  // If all players have passed, bidding ends
  if (biddingState.passes.length === totalPlayers) {
    return true;
  }

  // If there's a highest bid and all other players have passed, bidding ends
  if (biddingState.highestBid && biddingState.passes.length === totalPlayers - 1) {
    return true;
  }

  return false;
}

/**
 * Gets the next player in bidding order
 */
export function getNextBidder(currentBidder: string, players: Player[]): string {
  if (players.length === 0) {
    return currentBidder;
  }

  const currentIndex = players.findIndex(player => player.id === currentBidder);
  
  if (currentIndex === -1) {
    // Current bidder not found, return first player
    return players[0].id;
  }

  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
}

/**
 * Creates a new bid object
 */
export function createBid(playerId: string, amount: number, trump: DominoSuit): Bid {
  return {
    playerId,
    amount,
    trump
  };
}

/**
 * Updates bidding state after a successful bid
 */
export function updateBiddingStateAfterBid(
  biddingState: ExtendedBiddingState,
  bid: Bid,
  players: Player[]
): ExtendedBiddingState {
  const newBids = [...biddingState.bids, bid];
  const newState: BiddingState = {
    ...biddingState,
    bids: newBids,
    highestBid: bid,
    currentBidder: getNextBidder(bid.playerId, players)
  };

  // Check if bidding should end
  if (shouldEndBidding(newState, players)) {
    newState.isComplete = true;
    newState.winner = bid.playerId;
  }

  return newState;
}

/**
 * Updates bidding state after a pass
 */
export function updateBiddingStateAfterPass(
  biddingState: ExtendedBiddingState,
  playerId: string,
  players: Player[]
): ExtendedBiddingState {
  const newPasses = [...biddingState.passes, playerId];
  const newState: BiddingState = {
    ...biddingState,
    passes: newPasses,
    currentBidder: getNextBidder(playerId, players)
  };

  // Check if bidding should end
  if (shouldEndBidding(newState, players)) {
    newState.isComplete = true;
    newState.winner = newState.highestBid?.playerId || null;
  }

  return newState;
}

/**
 * Gets a human-readable error message for a validation error
 */
export function getValidationErrorMessage(error: BiddingValidationError): string {
  switch (error) {
    case BiddingValidationError.BID_TOO_LOW:
      return 'Bid must be at least 30';
    case BiddingValidationError.BID_TOO_HIGH:
      return 'Bid cannot exceed 42';
    case BiddingValidationError.BID_NOT_HIGHER:
      return 'Bid must be higher than the current highest bid';
    case BiddingValidationError.NOT_CURRENT_BIDDER:
      return 'It is not your turn to bid';
    case BiddingValidationError.INVALID_TRUMP_SUIT:
      return 'Please select a valid trump suit';
    case BiddingValidationError.BIDDING_COMPLETE:
      return 'Bidding has already ended';
    default:
      return 'Invalid bid';
  }
}
