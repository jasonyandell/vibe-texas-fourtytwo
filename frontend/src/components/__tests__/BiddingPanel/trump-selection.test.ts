import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { DominoSuit } from '@/types/texas42';
import { testHelpers } from './test-helpers';

export function trumpSelectionTests(defaultProps: ReturnType<typeof testHelpers.createDefaultProps>) {
  describe('Trump Suit Selection', () => {
    it('renders all trump suit options', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      const trumpSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
      trumpSuits.forEach(suit => {
        expect(screen.getByRole('option', { name: new RegExp(suit, 'i') })).toBeInTheDocument();
      });
    });

    it('allows trump suit selection', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const trumpSelect = screen.getByLabelText(/trump suit/i);
      await user.selectOptions(trumpSelect, 'sixes');

      expect(trumpSelect).toHaveValue('sixes');
    });
  });
}