import { GameState, PlayerPosition, DominoSuit, createCompatibleBid, createCompatibleBiddingState } from '@texas42/shared-types';

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

  const handleBid = (amount: number, trump: DominoSuit) => {
    if (!gameState || !currentPlayerId || !updateGameState) {
      console.error('Cannot place bid: missing game state, player ID, or update function');
      return;
    }

    try {
      const bid = createCompatibleBid(currentPlayerId, amount, trump);
      const updatedBiddingState = createCompatibleBiddingState({
        currentBid: bid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), bid],
        currentBidder: getNextBidder(currentPlayerId),
        minimumBid: amount + 1,
        biddingComplete: false,
        passCount: gameState.biddingState?.passCount || 0
      });

      const passCount = gameState.biddingState?.passCount || 0;
      if (passCount >= 3) {
        updatedBiddingState.biddingComplete = true;
      }

      const updatedGameState = {
        ...gameState,
        currentBid: bid,
        trump: trump,
        biddingState: updatedBiddingState,
        currentPlayer: updatedBiddingState.biddingComplete ? gameState.dealer : updatedBiddingState.currentBidder,
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
      const passBid = createCompatibleBid(currentPlayerId, 0, 'blanks');
      const newPassCount = (gameState.biddingState?.passCount || 0) + 1;
      const biddingComplete = newPassCount >= 3 && !gameState.currentBid;

      const updatedBiddingState = createCompatibleBiddingState({
        currentBid: gameState.biddingState?.currentBid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), passBid],
        currentBidder: getNextBidder(currentPlayerId),
        passCount: newPassCount,
        biddingComplete,
        minimumBid: gameState.biddingState?.minimumBid || 30
      });

      const updatedGameState = {
        ...gameState,
        biddingState: updatedBiddingState,
        currentPlayer: biddingComplete ? gameState.dealer : updatedBiddingState.currentBidder,
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