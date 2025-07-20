import { DominoSuit, Bid, Player } from '@/types/texas42';
import { ExtendedBiddingState } from './types';

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
  const newState: ExtendedBiddingState = {
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
  const newState: ExtendedBiddingState = {
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