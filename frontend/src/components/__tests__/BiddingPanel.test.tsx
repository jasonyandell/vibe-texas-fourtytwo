import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { createUserEvent } from '@/test/test-utils';
import { BiddingPanel } from '../BiddingPanel';
import { DominoSuit, Bid } from '@/types/texas42';

describe('BiddingPanel', () => {
  const mockOnBid = vi.fn();
  const mockOnPass = vi.fn();

  const defaultProps = {
    currentBid: null,
    currentBidder: 'player1',
    isCurrentPlayer: true,
    minimumBid: 30,
    onBid: mockOnBid,
    onPass: mockOnPass,
    disabled: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders bidding panel with all controls', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      expect(screen.getByLabelText(/bid amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trump suit/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /place bid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pass/i })).toBeInTheDocument();
    });

    it('shows current bid when provided', () => {
      const currentBid: Bid = { playerId: 'player2', amount: 35, trump: 'sixes' };
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

  describe('Bid Amount Input', () => {
    it('sets minimum bid amount as default', () => {
      render(<BiddingPanel {...defaultProps} />);
      
      const bidInput = screen.getByLabelText(/bid amount/i);
      expect(bidInput).toHaveValue(30);
    });

    it('sets minimum bid higher than current bid', () => {
      const currentBid: Bid = { playerId: 'player2', amount: 35, trump: 'sixes' };
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

  describe('Bid Validation', () => {
    it('shows error when bid is not higher than current bid', async () => {
      const user = createUserEvent();
      const currentBid: Bid = { playerId: 'player2', amount: 35, trump: 'sixes' };
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
});
