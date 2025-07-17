import { useCallback, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import {
  validateBid,
  getMinimumBid,
  canPlayerBid,
  updateBiddingStateAfterBid,
  updateBiddingStateAfterPass,
  createBid,
  getValidationErrorMessage,
  ExtendedBiddingState
} from '@/utils/biddingValidation';
import { DominoSuit, Bid, BiddingState, GameState } from '@/types/texas42';

/**
 * Convert the existing BiddingState to ExtendedBiddingState for validation
 */
function convertToExtendedBiddingState(
  biddingState: BiddingState | undefined,
  currentBidder?: string
): ExtendedBiddingState {
  if (!biddingState) {
    return {
      currentBidder,
      currentBid: undefined,
      bidHistory: [],
      biddingComplete: false,
      passCount: 0,
      minimumBid: 30,
      bids: [],
      passes: [],
      highestBid: null,
      isComplete: false,
      winner: null
    };
  }

  // Find the highest bid from bidHistory
  const highestBid = biddingState.bidHistory.length > 0 
    ? biddingState.bidHistory.reduce((highest, bid) => 
        bid.amount > (highest?.amount || 0) ? bid : highest
      )
    : null;

  // Calculate passes from passCount (simplified approach)
  const passes: string[] = [];
  for (let i = 0; i < biddingState.passCount; i++) {
    passes.push(`pass_${i}`); // Placeholder - in real implementation, track actual player IDs
  }

  return {
    currentBidder: biddingState.currentBidder || currentBidder,
    currentBid: biddingState.currentBid,
    bidHistory: biddingState.bidHistory,
    biddingComplete: biddingState.biddingComplete,
    passCount: biddingState.passCount,
    minimumBid: biddingState.minimumBid,
    bids: biddingState.bidHistory, // Use bidHistory as bids
    passes,
    highestBid,
    isComplete: biddingState.biddingComplete,
    winner: highestBid?.playerId || null
  };
}



export interface BiddingActions {
  placeBid: (amount: number, trump: DominoSuit) => Promise<{ success: boolean; error?: string }>;
  passBid: () => Promise<{ success: boolean; error?: string }>;
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

/**
 * Custom hook for managing bidding state
 */
export function useBiddingState(): BiddingStateHook {
  const { gameState, updateGameState, isLoading, error: gameError } = useGameState();

  // Convert current game state to extended bidding state
  const biddingState = useMemo(() => {
    return convertToExtendedBiddingState(
      gameState?.biddingState,
      gameState?.currentPlayer
    );
  }, [gameState?.biddingState, gameState?.currentPlayer]);

  // Get current player ID (this would come from authentication/session in real app)
  const currentPlayerId = gameState?.currentPlayer;
  const players = useMemo(() => gameState?.players || [], [gameState?.players]);

  const validateBidInput = useCallback((amount: number, trump: DominoSuit) => {
    if (!currentPlayerId) {
      return { isValid: false, error: 'No current player' };
    }

    const result = validateBid(amount, trump, biddingState, currentPlayerId);
    return {
      isValid: result.isValid,
      error: result.error ? getValidationErrorMessage(result.error) : undefined
    };
  }, [biddingState, currentPlayerId]);

  const placeBid = useCallback((amount: number, trump: DominoSuit) => {
    if (!currentPlayerId || !gameState) {
      return { success: false, error: 'No current player or game state' };
    }

    // Validate the bid
    const validation = validateBidInput(amount, trump);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      // Create the bid
      const bid = createBid(currentPlayerId, amount, trump);
      
      // Update the bidding state
      const updatedBiddingState = updateBiddingStateAfterBid(biddingState, bid, players);

      // Convert back to standard format with proper updates
      const standardBiddingState: BiddingState = {
        currentBidder: updatedBiddingState.currentBidder,
        currentBid: bid,
        bidHistory: [...biddingState.bidHistory, bid],
        biddingComplete: updatedBiddingState.isComplete,
        passCount: biddingState.passCount,
        minimumBid: updatedBiddingState.isComplete ? biddingState.minimumBid : bid.amount + 1
      };

      // Update the game state
      const gameUpdates: Partial<GameState> = {
        biddingState: standardBiddingState,
        currentPlayer: updatedBiddingState.currentBidder,
        updatedAt: new Date().toISOString()
      };

      // If bidding is complete, set the bidder and trump
      if (updatedBiddingState.isComplete && updatedBiddingState.winner) {
        gameUpdates.bidder = updatedBiddingState.winner;
        gameUpdates.trump = trump;
        gameUpdates.currentBid = bid;
        gameUpdates.phase = 'playing';
      }

      updateGameState(gameUpdates);

      return { success: true };
    } catch (error) {
      console.error('Error placing bid:', error);
      return { success: false, error: 'Failed to place bid' };
    }
  }, [currentPlayerId, gameState, biddingState, players, validateBidInput, updateGameState]);

  const passBid = useCallback(() => {
    if (!currentPlayerId || !gameState) {
      return { success: false, error: 'No current player or game state' };
    }

    if (!canPlayerBid(currentPlayerId, biddingState)) {
      return { success: false, error: 'Cannot pass - not your turn or bidding is complete' };
    }

    try {
      // Update the bidding state after pass
      const updatedBiddingState = updateBiddingStateAfterPass(biddingState, currentPlayerId, players);

      // Convert back to standard format with proper updates
      const standardBiddingState: BiddingState = {
        currentBidder: updatedBiddingState.currentBidder,
        currentBid: biddingState.currentBid,
        bidHistory: biddingState.bidHistory,
        biddingComplete: updatedBiddingState.isComplete,
        passCount: biddingState.passCount + 1,
        minimumBid: biddingState.minimumBid
      };

      // Update the game state
      const gameUpdates: Partial<GameState> = {
        biddingState: standardBiddingState,
        currentPlayer: updatedBiddingState.currentBidder,
        updatedAt: new Date().toISOString()
      };

      // If bidding is complete, set the bidder and trump (if there's a winner)
      if (updatedBiddingState.isComplete) {
        if (updatedBiddingState.winner && updatedBiddingState.highestBid) {
          gameUpdates.bidder = updatedBiddingState.winner;
          gameUpdates.trump = updatedBiddingState.highestBid.trump;
          gameUpdates.currentBid = updatedBiddingState.highestBid;
          gameUpdates.phase = 'playing';
        } else {
          // All players passed - need to redeal or handle according to game rules
          gameUpdates.phase = 'bidding'; // Reset or handle as needed
        }
      }

      updateGameState(gameUpdates);

      return { success: true };
    } catch (error) {
      console.error('Error passing bid:', error);
      return { success: false, error: 'Failed to pass bid' };
    }
  }, [currentPlayerId, gameState, biddingState, players, updateGameState]);

  const getMinimumBidAmount = useCallback(() => {
    return getMinimumBid(biddingState);
  }, [biddingState]);

  const canCurrentPlayerBid = useCallback(() => {
    return currentPlayerId ? canPlayerBid(currentPlayerId, biddingState) : false;
  }, [currentPlayerId, biddingState]);

  const isBiddingComplete = useCallback(() => {
    return biddingState.isComplete;
  }, [biddingState.isComplete]);

  const getCurrentBidder = useCallback(() => {
    return biddingState.currentBidder;
  }, [biddingState.currentBidder]);

  const getHighestBid = useCallback(() => {
    return biddingState.highestBid;
  }, [biddingState.highestBid]);

  const getBidHistory = useCallback(() => {
    return biddingState.bidHistory;
  }, [biddingState.bidHistory]);

  const actions: BiddingActions = {
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

  return {
    biddingState,
    actions,
    isLoading,
    error: gameError?.message || null
  };
}
