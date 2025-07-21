import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { testHelpers } from './test-helpers';

export function accessibilityTests(defaultProps: ReturnType<typeof testHelpers.createDefaultProps>) {
  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      expect(screen.getByRole('group', { name: /bidding controls/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/bid amount/i)).toHaveAttribute('aria-describedby');
      expect(screen.getByLabelText(/trump suit/i)).toHaveAttribute('aria-describedby');
    });

    it('announces validation errors to screen readers', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      const bidInput = screen.getByLabelText(/bid amount/i);
      await user.clear(bidInput);
      await user.type(bidInput, '25');

      const errorMessage = screen.getByText(/bid must be between 30 and 42/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('supports keyboard navigation', async () => {
      const user = createUserEvent();
      render(<BiddingPanel {...defaultProps} />);

      // Tab through controls
      await user.tab();
      expect(screen.getByLabelText(/bid amount/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/trump suit/i)).toHaveFocus();

      // The bid button is now enabled (to allow showing validation errors)
      await user.tab();
      expect(screen.getByRole('button', { name: /place bid/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /pass/i })).toHaveFocus();
    });
  });
}