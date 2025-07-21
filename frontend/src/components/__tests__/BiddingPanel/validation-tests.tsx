import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { testHelpers } from './test-helpers';

export function validationTests(defaultProps: ReturnType<typeof testHelpers.createDefaultProps>) {
  describe('Bid Validation', () => {
    it('shows error when bid is not higher than current bid', async () => {
      const user = createUserEvent();
      const currentBid = testHelpers.createCurrentBid();
      render(<BiddingPanel {...defaultProps} currentBid={currentBid} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      await user.clear(bidInput);
      await user.type(bidInput, '35');

      expect(screen.getByText(/bid must be higher than current bid/i)).toBeInTheDocument();
    });

    it('shows error when trump suit not selected for valid bid', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidButton = screen.getByRole('button', { name: /place bid/i });
      await user.click(bidButton);

      expect(screen.getByText(/must select trump suit/i)).toBeInTheDocument();
    });

    it('disables bid button when validation fails', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      await user.clear(bidInput);
      await user.type(bidInput, '25');

      const bidButton = screen.getByRole('button', { name: /place bid/i });
      expect(bidButton).toBeDisabled();
    });
  });
}