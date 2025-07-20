import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Error Handling', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles missing handlers gracefully', () => {
    expect(() => {
      render(<ReadySystem players={mockPlayers} gameId="test-game" />);
    }).not.toThrow();
  });

  it('handles start game errors gracefully', async () => {
    const user = userEvent.setup({ delay: null });
    const failingHandler = vi.fn().mockRejectedValue(new Error('Start failed'));
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
    
    render(
      <ReadySystem 
        players={allReadyPlayers} 
        gameId="test-game" 
        onStartGame={failingHandler}
        autoStartTimeout={9999} // Disable auto-start for this test
      />
    );
    
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    
    // The console.error is expected for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await user.click(startButton);
    
    // Wait for the promise to reject and state to update
    await waitFor(() => {
      expect(failingHandler).toHaveBeenCalledWith('test-game');
    });
    
    // Button should return to enabled state after error
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Start Game Now' });
      expect(button).toBeEnabled();
    });
    
    consoleSpy.mockRestore();
  });

  it('handles null players in array', () => {
    const playersWithNulls = [mockPlayers[0], null, mockPlayers[2], null];
    
    render(<ReadySystem players={playersWithNulls} gameId="test-game" />);
    
    // Should show waiting message since we only have 2 players
    expect(screen.getByText('Waiting for 2 more players')).toBeInTheDocument();
  });
});