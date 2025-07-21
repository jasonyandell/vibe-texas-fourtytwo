import { GameState, BiddingState } from '@texas42/shared-types';
import { ExtendedBiddingState } from '@/utils/biddingValidation';
import { convertHighestBid } from './stateConverters';
import { DominoSuit } from '@/types/texas42';

interface UpdateGameStateParams {
  gameState: GameState;
  updatedBiddingState: ExtendedBiddingState;
  standardBiddingState: BiddingState;
  trump?: DominoSuit;
}

export function createUpdatedGameState({
  gameState,
  updatedBiddingState,
  standardBiddingState,
  trump
}: UpdateGameStateParams): GameState {
  const updatedGameState: GameState = {
    ...gameState,
    biddingState: standardBiddingState,
    currentPlayer: updatedBiddingState.currentBidder,
    updatedAt: new Date().toISOString()
  };

  if (updatedBiddingState.isComplete) {
    if (updatedBiddingState.winner && updatedBiddingState.highestBid) {
      updatedGameState.trump = trump || updatedBiddingState.highestBid.trump;
      updatedGameState.currentBid = convertHighestBid(updatedBiddingState.highestBid);
      updatedGameState.phase = 'playing';
    } else {
      // All players passed - need to redeal or handle according to game rules
      updatedGameState.phase = 'bidding';
    }
  }

  return updatedGameState;
}