import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { testHelpers } from './test-helpers';

export function submissionTests(
  defaultProps: ReturnType<typeof testHelpers.createDefaultProps>,
  mockOnBid: ReturnType<typeof import('vitest').vi.fn>,
  mockOnPass: ReturnType<typeof import('vitest').vi.fn>
) {
  describe('Bid Submission', () => {
    it('calls onBid with correct parameters when valid bid submitted', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      const trumpSelect = screen.getByLabelText(/trump suit/i);
      const bidButton = screen.getByRole('button', { name: /place bid/i });

      await user.clear(bidInput);
      await user.type(bidInput, '35');
      await user.selectOptions(trumpSelect, 'sixes');
      await user.click(bidButton);

      expect(mockOnBid).toHaveBeenCalledWith(35, 'sixes');
    });

    it('calls onPass when pass button clicked', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const passButton = screen.getByRole('button', { name: /pass/i });
      await user.click(passButton);

      expect(mockOnPass).toHaveBeenCalled();
    });

    it('resets form after successful bid', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      const trumpSelect = screen.getByLabelText(/trump suit/i);
      const bidButton = screen.getByRole('button', { name: /place bid/i });

      await user.clear(bidInput);
      await user.type(bidInput, '35');
      await user.selectOptions(trumpSelect, 'sixes');
      await user.click(bidButton);

      // Form should reset to minimum bid and no trump selected
      expect(bidInput).toHaveValue(30);
      expect(trumpSelect).toHaveValue('');
    });
  });
}