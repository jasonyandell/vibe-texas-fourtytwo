import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { BiddingPanel } from '../../BiddingPanel';
import { testHelpers } from './test-helpers';

export function renderingTests(defaultProps: ReturnType<typeof testHelpers.createDefaultProps>) {
  describe('Basic Rendering', () => {
    it('renders bidding panel with all controls', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      expect(screen.getByLabelText(/bid amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trump suit/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /place bid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pass/i })).toBeInTheDocument();
    });

    it('shows current bid when provided', () => {
      const currentBid = testHelpers.createCurrentBid();
      render(<BiddingPanel {...defaultProps} currentBid={currentBid} />);
      
      expect(screen.getByText(/current bid: 35/i)).toBeInTheDocument();
      expect(screen.getByText(/trump: sixes/i)).toBeInTheDocument();
    });

    it('shows minimum bid when no current bid', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      expect(screen.getByText(/minimum bid: 30/i)).toBeInTheDocument();
    });

    it('disables controls when not current player', () => {
      render(<BiddingPanel {...defaultProps} isCurrentPlayer={false} />);
      
      expect(screen.getByLabelText(/bid amount/i)).toBeDisabled();
      expect(screen.getByLabelText(/trump suit/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /place bid/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /pass/i })).toBeDisabled();
    });

    it('disables controls when disabled prop is true', () => {
      render(<BiddingPanel {...defaultProps} disabled={true} />);
      
      expect(screen.getByLabelText(/bid amount/i)).toBeDisabled();
      expect(screen.getByLabelText(/trump suit/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /place bid/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /pass/i })).toBeDisabled();
    });
  });
}