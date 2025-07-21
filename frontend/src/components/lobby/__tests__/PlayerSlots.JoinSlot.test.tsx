import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers, mockHandlers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Join Slot Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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