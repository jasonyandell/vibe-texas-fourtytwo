import { DominoSuit } from '@/types/texas42';
import { GameState, Bid, createCompatibleBid } from '@texas42/shared-types';
import {
  validateBid,
  getMinimumBid,
  canPlayerBid,
  updateBiddingStateAfterBid,
  updateBiddingStateAfterPass,
  getValidationErrorMessage,
  ExtendedBiddingState
} from '@/utils/biddingValidation';
import { convertBidHistory, createStandardBiddingState } from './stateConverters';
import { createUpdatedGameState } from './gameStateUpdaters';

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

      // Convert to standard format
      const standardBiddingState = createStandardBiddingState(
        updatedBiddingState,
        biddingState,
        bid,
        false
      );

      // Update the game state
      if (gameState) {
        const updatedGameState = createUpdatedGameState({
          gameState,
          updatedBiddingState,
          standardBiddingState,
          trump
        });

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

      // Convert to standard format
      const standardBiddingState = createStandardBiddingState(
        updatedBiddingState,
        biddingState,
        undefined,
        true
      );

      // Update the game state
      if (gameState) {
        const updatedGameState = createUpdatedGameState({
          gameState,
          updatedBiddingState,
          standardBiddingState
        });

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
    return convertBidHistory(biddingState.bidHistory);
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