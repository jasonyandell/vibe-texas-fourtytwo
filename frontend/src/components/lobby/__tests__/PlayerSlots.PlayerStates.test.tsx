import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers, mockHandlers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Player Slot States', () => {
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