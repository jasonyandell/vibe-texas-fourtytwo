import { GameState, PlayerPosition, DominoSuit, createRegularBid, createPassBid } from '@texas42/shared-types';

export const useGameBoardBidding = (
  gameState: GameState | undefined,
  currentPlayerId: string | undefined,
  updateGameState: ((gameState: GameState) => void) | undefined
) => {
  const getNextBidder = (currentBidderId: string): string => {
    if (!gameState) return '';
    const playerPositions: PlayerPosition[] = ['north', 'east', 'south', 'west'];
    const currentPlayer = gameState.players.find(p => p.id === currentBidderId);
    if (!currentPlayer) return gameState.players[0]?.id || '';

    const currentIndex = playerPositions.indexOf(currentPlayer.position);
    const nextIndex = (currentIndex + 1) % 4;
    const nextPosition = playerPositions[nextIndex];

    const nextPlayer = gameState.players.find(p => p.position === nextPosition);
    return nextPlayer?.id || '';
  };

  const handleBid = (amount: number, trump?: DominoSuit) => {
    if (!gameState || !currentPlayerId || !updateGameState) {
      console.error('Cannot place bid: missing game state, player ID, or update function');
      return;
    }

    try {
      // During bidding, we don't specify trump yet - use blanks as placeholder
      const bid = createRegularBid(currentPlayerId, amount, trump || 'blanks');
      
      // Reset pass count on new bid
      const updatedBiddingState = {
        currentBid: bid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), bid],
        currentBidder: getNextBidder(currentPlayerId),
        minimumBid: amount + 1,
        biddingComplete: false,
        passCount: 0, // Reset pass count when someone bids
        forcedBidActive: false
      };

      // Check if bidding is complete (3 passes after a bid)
      const consecutivePasses = gameState.biddingState?.passCount || 0;
      if (consecutivePasses >= 3 && gameState.currentBid) {
        updatedBiddingState.biddingComplete = true;
      }

      const updatedGameState = {
        ...gameState,
        currentBid: bid,
        // Don't set trump until after bidding is complete
        biddingState: updatedBiddingState,
        currentPlayer: updatedBiddingState.biddingComplete ? bid.playerId : updatedBiddingState.currentBidder,
        phase: updatedBiddingState.biddingComplete ? 'playing' as const : 'bidding' as const,
        updatedAt: new Date().toISOString()
      };

      updateGameState(updatedGameState);
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };

  const handlePass = () => {
    if (!gameState || !currentPlayerId || !updateGameState) {
      console.error('Cannot pass: missing game state, player ID, or update function');
      return;
    }

    try {
      const passBid = createPassBid(currentPlayerId);
      const newPassCount = (gameState.biddingState?.passCount || 0) + 1;
      
      // Bidding is complete if 3 passes after a bid exists, or 4 passes total (no one bid)
      const biddingComplete = gameState.currentBid 
        ? newPassCount >= 3 
        : newPassCount >= 4;

      const updatedBiddingState = {
        currentBid: gameState.currentBid || gameState.biddingState?.currentBid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), passBid],
        currentBidder: getNextBidder(currentPlayerId),
        passCount: newPassCount,
        biddingComplete,
        minimumBid: gameState.biddingState?.minimumBid || 30,
        forcedBidActive: gameState.biddingState?.forcedBidActive || false
      };

      const updatedGameState = {
        ...gameState,
        biddingState: updatedBiddingState,
        currentPlayer: biddingComplete 
          ? (gameState.currentBid?.playerId || gameState.dealer) 
          : updatedBiddingState.currentBidder,
        phase: biddingComplete ? 'playing' as const : 'bidding' as const,
        updatedAt: new Date().toISOString()
      };

      updateGameState(updatedGameState);
    } catch (error) {
      console.error('Failed to pass:', error);
    }
  };

  return {
    handleBid,
    handlePass
  };
};