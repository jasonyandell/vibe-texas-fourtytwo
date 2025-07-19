import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerSlots, Player } from '../PlayerSlots';

describe('PlayerSlots', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'player1', name: 'Alice', position: 'north', isReady: true },
    { id: 'player2', name: 'Bob', position: 'east', isReady: false },
    null, // Empty slot
    { id: 'player4', name: 'Charlie', position: 'west', isReady: true }
  ];

  const mockHandlers = {
    onJoinSlot: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders all four player slots', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByText('North')).toBeInTheDocument();
      expect(screen.getByText('East')).toBeInTheDocument();
      expect(screen.getByText('South')).toBeInTheDocument();
      expect(screen.getByText('West')).toBeInTheDocument();
    });

    it('displays partnership information', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByText('North-South')).toBeInTheDocument();
      expect(screen.getByText('East-West')).toBeInTheDocument();
    });

    it('shows player names in partnership display', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      // North-South partnership
      const northSouthSection = screen.getByText('North-South').parentElement;
      expect(northSouthSection).toHaveTextContent('Alice');
      expect(northSouthSection).toHaveTextContent('Empty');
      
      // East-West partnership
      const eastWestSection = screen.getByText('East-West').parentElement;
      expect(eastWestSection).toHaveTextContent('Bob');
      expect(eastWestSection).toHaveTextContent('Charlie');
    });
  });

  describe('Player Slot States', () => {
    it('renders occupied slots with player information', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByTestId('player-name-north')).toHaveTextContent('Alice');
      expect(screen.getByTestId('player-name-east')).toHaveTextContent('Bob');
      expect(screen.getByTestId('player-name-west')).toHaveTextContent('Charlie');
    });

    it('renders empty slots with join prompt', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlots = screen.getAllByText('Click to join');
      expect(emptySlots).toHaveLength(1); // Only one empty slot
    });

    it('shows player avatars with initials', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByText('A')).toBeInTheDocument(); // Alice
      expect(screen.getByText('B')).toBeInTheDocument(); // Bob
      expect(screen.getByText('C')).toBeInTheDocument(); // Charlie
    });

    it('highlights current user with "You" badge', () => {
      render(<PlayerSlots players={mockPlayers} currentUserId="player1" gameStatus="waiting" />);
      
      expect(screen.getByText('You')).toBeInTheDocument();
    });
  });

  describe('Ready Status Display', () => {
    it('shows ready status for waiting games', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getAllByText('Ready')).toHaveLength(2); // Alice and Charlie are ready
      expect(screen.getAllByText('Not Ready')).toHaveLength(1); // Bob is not ready
    });

    it('hides ready status for playing games', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="playing" />);
      
      expect(screen.queryByText('Ready')).not.toBeInTheDocument();
      expect(screen.queryByText('Not Ready')).not.toBeInTheDocument();
    });

    it('hides ready status for finished games', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="finished" />);
      
      expect(screen.queryByText('Ready')).not.toBeInTheDocument();
      expect(screen.queryByText('Not Ready')).not.toBeInTheDocument();
    });

    it('applies correct badge variants for ready status', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      const readyBadges = screen.getAllByText('Ready');
      const notReadyBadges = screen.getAllByText('Not Ready');
      
      expect(readyBadges.length).toBeGreaterThan(0);
      expect(notReadyBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Join Slot Functionality', () => {
    it('makes empty slots clickable when game is waiting', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
      expect(emptySlot).toBeInTheDocument();
      expect(emptySlot).toHaveAttribute('tabIndex', '0');
    });

    it('calls onJoinSlot when empty slot is clicked', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
      fireEvent.click(emptySlot!);
      
      expect(mockHandlers.onJoinSlot).toHaveBeenCalledWith(2); // South position (index 2)
    });

    it('does not make empty slots clickable when game is playing', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="playing" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Empty slot').closest('div');
      expect(emptySlot).not.toHaveAttribute('role', 'button');
    });

    it('does not make empty slots clickable when no handler provided', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      const emptySlot = screen.getByText('Empty slot').closest('div');
      expect(emptySlot).not.toHaveAttribute('role', 'button');
    });
  });

  describe('Position Layout', () => {
    it('applies correct position data attributes', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByText('North').closest('[data-position]')).toHaveAttribute('data-position', 'north');
      expect(screen.getByText('East').closest('[data-position]')).toHaveAttribute('data-position', 'east');
      expect(screen.getByText('South').closest('[data-position]')).toHaveAttribute('data-position', 'south');
      expect(screen.getByText('West').closest('[data-position]')).toHaveAttribute('data-position', 'west');
    });

    it('marks current user slot with data attribute', () => {
      render(<PlayerSlots players={mockPlayers} currentUserId="player1" gameStatus="waiting" />);
      
      const aliceSlot = screen.getAllByText('Alice')[1].closest('[data-current-user]'); // Use the slot Alice, not partnership Alice
      expect(aliceSlot).toHaveAttribute('data-current-user', 'true');
    });

    it('applies correct CSS classes for slot states', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      const occupiedSlot = screen.getAllByText('Alice')[1].closest('[data-position]');
      const emptySlot = screen.getByText('Empty slot').closest('[data-position]');
      
      // CSS modules generate hashed class names, so we check for the presence of classes
      expect(occupiedSlot?.className).toContain('occupiedSlot');
      expect(emptySlot?.className).toContain('emptySlot');
    });
  });

  describe('Edge Cases', () => {
    it('handles all empty slots', () => {
      const emptyPlayers = [null, null, null, null];
      render(<PlayerSlots players={emptyPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlots = screen.getAllByText(/Empty slot|Click to join/);
      expect(emptySlots).toHaveLength(4);
    });

    it('handles all occupied slots', () => {
      const fullPlayers: Player[] = [
        { id: 'p1', name: 'Alice', position: 'north', isReady: true },
        { id: 'p2', name: 'Bob', position: 'east', isReady: false },
        { id: 'p3', name: 'Carol', position: 'south', isReady: true },
        { id: 'p4', name: 'Dave', position: 'west', isReady: false }
      ];
      render(<PlayerSlots players={fullPlayers} gameStatus="waiting" />);
      
      expect(screen.getAllByText('Alice')).toHaveLength(2); // Name appears in slot and partnership
      expect(screen.getAllByText('Bob')).toHaveLength(2);
      expect(screen.getAllByText('Carol')).toHaveLength(2);
      expect(screen.getAllByText('Dave')).toHaveLength(2);
      expect(screen.queryByText('Empty slot')).not.toBeInTheDocument();
    });

    it('handles missing player names gracefully', () => {
      const playersWithEmptyName: (Player | null)[] = [
        { id: 'p1', name: '', position: 'north', isReady: true },
        null, null, null
      ];
      
      expect(() => {
        render(<PlayerSlots players={playersWithEmptyName} gameStatus="waiting" />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for empty slots', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByLabelText('Join as South player');
      expect(emptySlot).toBeInTheDocument();
    });

    it('supports keyboard navigation for joinable slots', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
      expect(emptySlot).toHaveAttribute('tabIndex', '0');
    });

    it('excludes non-interactive slots from tab order', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="playing" />);
      
      const occupiedSlots = screen.getAllByText(/Alice|Bob|Charlie/).filter(
        // Filter to only get the player slots, not partnership mentions
        el => el.closest('[data-position]')
      );
      
      occupiedSlots.forEach(slot => {
        const slotElement = slot.closest('[data-position]');
        expect(slotElement).not.toHaveAttribute('tabIndex');
      });
    });

    it('provides semantic structure with proper headings', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      expect(screen.getByRole('heading', { name: 'Players' })).toBeInTheDocument();
    });

    it('groups partnership information semantically', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
      
      // Using a more reliable selector since CSS modules hash class names
      const partnerships = screen.getByText('North-South').closest('div[class*="partnerships"]');
      expect(partnerships).toBeInTheDocument();
    });
  });

  describe('Keyboard Interaction', () => {
    it('handles Enter key on joinable slots', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
      fireEvent.keyDown(emptySlot!, { key: 'Enter' });
      
      expect(mockHandlers.onJoinSlot).toHaveBeenCalledWith(2);
    });

    it('handles Space key on joinable slots', () => {
      render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
      
      const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
      fireEvent.keyDown(emptySlot!, { key: ' ' });
      
      expect(mockHandlers.onJoinSlot).toHaveBeenCalledWith(2);
    });
  });
});