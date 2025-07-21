import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { testHelpers } from './test-helpers';

export function bidAmountTests(defaultProps: ReturnType<typeof testHelpers.createDefaultProps>) {
  describe('Bid Amount Input', () => {
    it('sets minimum bid amount as default', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      const bidInput = screen.getByLabelText(/bid amount/i);
      expect(bidInput).toHaveValue(30);
    });

    it('sets minimum bid higher than current bid', () => {
      const currentBid = testHelpers.createCurrentBid();
      render(<BiddingPanel {...defaultProps} currentBid={currentBid} />);
      
      const bidInput = screen.getByLabelText(/bid amount/i);
      expect(bidInput).toHaveValue(36);
    });

    it('allows bid amount input within valid range', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      await user.clear(bidInput);
      await user.type(bidInput, '35');

      expect(bidInput).toHaveValue(35);
    });

    it('validates bid amount range (30-42)', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);

      // Test below minimum
      await user.clear(bidInput);
      await user.type(bidInput, '25');
      expect(screen.getByText(/bid must be between 30 and 42/i)).toBeInTheDocument();

      // Test above maximum
      await user.clear(bidInput);
      await user.type(bidInput, '45');
      expect(screen.getByText(/bid must be between 30 and 42/i)).toBeInTheDocument();
    });
  });
}