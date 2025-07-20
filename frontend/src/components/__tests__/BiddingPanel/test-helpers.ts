import { vi } from 'vitest';
import { Bid } from '@/types/texas42';

export const testHelpers = {
  createDefaultProps: (mockOnBid: ReturnType<typeof vi.fn>, mockOnPass: ReturnType<typeof vi.fn>) => ({
    currentBid: null,
    currentBidder: 'player1',
    isCurrentPlayer: true,
    minimumBid: 30,
    onBid: mockOnBid,
    onPass: mockOnPass,
    disabled: false
  }),

  createCurrentBid: (amount: number = 35): Bid => ({
    playerId: 'player2',
    amount,
    trump: 'sixes'
  })
};