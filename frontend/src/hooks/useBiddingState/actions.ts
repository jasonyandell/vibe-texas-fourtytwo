import { DominoSuit } from '@/types/texas42';
import {
  GameState,
  Bid,
  createCompatibleBid,
  createCompatibleBiddingState
} from '@texas42/shared-types';
import {
  validateBid,
  getMinimumBid,
  canPlayerBid,
  updateBiddingStateAfterBid,
  updateBiddingStateAfterPass,
  getValidationErrorMessage,
  ExtendedBiddingState
} from '@/utils/biddingValidation';

interface CreateActionsParams {
  biddingState: ExtendedBiddingState;
  currentPlayerId: string | undefined;
  gameState: GameState | null;
  players: string[];
  updateGameState: (state: GameState) => void;
}

export function createBiddingActions({
  biddingState,
  currentPlayerId,
  gameState,
  players,
  updateGameState
}: CreateActionsParams) {
  const validateBidInput = (amount: number, trump: DominoSuit) => {
    if (!currentPlayerId) {
      return { isValid: false, error: 'No current player' };
    }

    const result = validateBid(amount, trump, biddingState, currentPlayerId);
    return {
      isValid: result.isValid,
      error: result.error ? getValidationErrorMessage(result.error) : undefined
    };
  };

  const placeBid = (amount: number, trump: DominoSuit) => {
    if (!currentPlayerId || !gameState) {
      return { success: false, error: 'No current player or game state' };
    }

    // Validate the bid
    const validation = validateBidInput(amount, trump);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      // Create the bid using compatibility helper
      const bid = createCompatibleBid(currentPlayerId, amount, trump);

      // Update the bidding state
      const updatedBiddingState = updateBiddingStateAfterBid(biddingState, bid, players);

      // Convert existing bid history to shared types format
      const convertedBidHistory = biddingState.bidHistory.map(oldBid =>
        createCompatibleBid(oldBid.playerId, oldBid.amount, oldBid.trump)
      );

      // Convert back to standard format with proper updates using compatibility helper
      const standardBiddingState = createCompatibleBiddingState({
        currentBidder: updatedBiddingState.currentBidder,
        currentBid: bid,
        bidHistory: [...convertedBidHistory, bid],
        biddingComplete: updatedBiddingState.isComplete,
        passCount: biddingState.passCount,
        minimumBid: updatedBiddingState.isComplete ? biddingState.minimumBid : bid.amount + 1
      });

      // Update the game state
      if (gameState) {
        const updatedGameState: GameState = {
          ...gameState,
          biddingState: standardBiddingState,
          currentPlayer: updatedBiddingState.currentBidder,
          updatedAt: new Date().toISOString()
        };

        // If bidding is complete, set the trump and current bid
        if (updatedBiddingState.isComplete && updatedBiddingState.winner) {
          updatedGameState.trump = trump;
          updatedGameState.currentBid = bid;
          updatedGameState.phase = 'playing';
        }

        updateGameState(updatedGameState);
      }

      return { success: true };
    } catch (error) {
      console.error('Error placing bid:', error);
      return { success: false, error: 'Failed to place bid' };
    }
  };

  const passBid = () => {
    if (!currentPlayerId || !gameState) {
      return { success: false, error: 'No current player or game state' };
    }

    if (!canPlayerBid(currentPlayerId, biddingState)) {
      return { success: false, error: 'Cannot pass - not your turn or bidding is complete' };
    }

    try {
      // Update the bidding state after pass
      const updatedBiddingState = updateBiddingStateAfterPass(biddingState, currentPlayerId, players);

      // Convert existing bid history to shared types format
      const convertedBidHistory = biddingState.bidHistory.map(oldBid =>
        createCompatibleBid(oldBid.playerId, oldBid.amount, oldBid.trump)
      );

      // Convert current bid if it exists
      const convertedCurrentBid = biddingState.currentBid
        ? createCompatibleBid(biddingState.currentBid.playerId, biddingState.currentBid.amount, biddingState.currentBid.trump)
        : undefined;

      // Convert back to standard format with proper updates using compatibility helper
      const standardBiddingState = createCompatibleBiddingState({
        currentBidder: updatedBiddingState.currentBidder,
        currentBid: convertedCurrentBid,
        bidHistory: convertedBidHistory,
        biddingComplete: updatedBiddingState.isComplete,
        passCount: biddingState.passCount + 1,
        minimumBid: biddingState.minimumBid
      });

      // Update the game state
      if (gameState) {
        const updatedGameState: GameState = {
          ...gameState,
          biddingState: standardBiddingState,
          currentPlayer: updatedBiddingState.currentBidder,
          updatedAt: new Date().toISOString()
        };

        // If bidding is complete, set the trump (if there's a winner)
        if (updatedBiddingState.isComplete) {
          if (updatedBiddingState.winner && updatedBiddingState.highestBid) {
            updatedGameState.trump = updatedBiddingState.highestBid.trump;
            // Convert the highest bid to shared types format
            const convertedHighestBid = updatedBiddingState.highestBid
              ? createCompatibleBid(updatedBiddingState.highestBid.playerId, updatedBiddingState.highestBid.amount, updatedBiddingState.highestBid.trump)
              : undefined;
            updatedGameState.currentBid = convertedHighestBid;
            updatedGameState.phase = 'playing';
          } else {
            // All players passed - need to redeal or handle according to game rules
            updatedGameState.phase = 'bidding'; // Reset or handle as needed
          }
        }

        updateGameState(updatedGameState);
      }

      return { success: true };
    } catch (error) {
      console.error('Error passing bid:', error);
      return { success: false, error: 'Failed to pass bid' };
    }
  };

  const getMinimumBidAmount = () => {
    return getMinimumBid(biddingState);
  };

  const canCurrentPlayerBid = () => {
    return currentPlayerId ? canPlayerBid(currentPlayerId, biddingState) : false;
  };

  const isBiddingComplete = () => {
    return biddingState.isComplete;
  };

  const getCurrentBidder = () => {
    return biddingState.currentBidder;
  };

  const getHighestBid = (): Bid | null => {
    if (!biddingState.highestBid) return null;
    return createCompatibleBid(
      biddingState.highestBid.playerId,
      biddingState.highestBid.amount,
      biddingState.highestBid.trump
    );
  };

  const getBidHistory = (): Bid[] => {
    return biddingState.bidHistory.map(oldBid =>
      createCompatibleBid(oldBid.playerId, oldBid.amount, oldBid.trump)
    );
  };

  return {
    placeBid,
    passBid,
    validateBidInput,
    getMinimumBidAmount,
    canCurrentPlayerBid,
    isBiddingComplete,
    getCurrentBidder,
    getHighestBid,
    getBidHistory
  };
}