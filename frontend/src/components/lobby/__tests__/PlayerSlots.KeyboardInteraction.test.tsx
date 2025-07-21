import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers, mockHandlers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Keyboard Interaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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