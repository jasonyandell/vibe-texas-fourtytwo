import { useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { convertToExtendedBiddingState } from './converters';
import { createBiddingActions } from './actions';
import { BiddingStateHook, BiddingActions } from './types';
import { DominoSuit } from '@/types/texas42';

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

  // Create the raw actions (not memoized)
  const rawActions = createBiddingActions({
    biddingState,
    currentPlayerId,
    gameState,
    players,
    updateGameState
  });

  // Memoize individual actions with useCallback
  const actions: BiddingActions = useMemo(() => ({
    placeBid: (amount: number, trump: DominoSuit) => rawActions.placeBid(amount, trump),
    passBid: () => rawActions.passBid(),
    validateBidInput: (amount: number, trump: DominoSuit) => rawActions.validateBidInput(amount, trump),
    getMinimumBidAmount: () => rawActions.getMinimumBidAmount(),
    canCurrentPlayerBid: () => rawActions.canCurrentPlayerBid(),
    isBiddingComplete: () => rawActions.isBiddingComplete(),
    getCurrentBidder: () => rawActions.getCurrentBidder(),
    getHighestBid: () => rawActions.getHighestBid(),
    getBidHistory: () => rawActions.getBidHistory()
  }), [rawActions]);

  return {
    biddingState,
    actions,
    isLoading,
    error: gameError?.message || null
  };
}

// Re-export types for convenience
export type { BiddingStateHook, BiddingActions } from './types';