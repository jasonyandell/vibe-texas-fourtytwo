import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Auto-Start Countdown', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  const mockHandlers = {
    onMarkReady: vi.fn(),
    onUnmarkReady: vi.fn(),
    onStartGame: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
  };

  const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts countdown when all players are ready', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByText('Starting in 10s')).toBeInTheDocument();
  });

  it('shows start game button when all players are ready', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByRole('button', { name: 'Start Game Now' })).toBeInTheDocument();
  });

  it('counts down correctly', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByText('Starting in 10s')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('Starting in 9s')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('Starting in 8s')).toBeInTheDocument();
  });

  it('calls onStartGame when countdown reaches zero', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(mockHandlers.onStartGame).toHaveBeenCalledWith('test-game');
  });

  it('allows manual start before countdown', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    act(() => {
      fireEvent.click(startButton);
    });
    
    expect(mockHandlers.onStartGame).toHaveBeenCalledWith('test-game');
  });

  it('shows cancel countdown button', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByRole('button', { name: 'Cancel Auto-Start' })).toBeInTheDocument();
  });

  it('cancels countdown when cancel button is clicked', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel Auto-Start' });
    act(() => {
      fireEvent.click(cancelButton);
    });
    
    expect(screen.queryByText(/Starting in/)).not.toBeInTheDocument();
  });

  it('uses custom timeout when provided', () => {
    render(
      <ReadySystem 
        players={allReadyPlayers} 
        gameId="test-game" 
        autoStartTimeout={5}
        {...mockHandlers} 
      />
    );
    
    expect(screen.getByText('Starting in 5s')).toBeInTheDocument();
  });

  it('disables buttons when game is starting', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    
    act(() => {
      fireEvent.click(startButton);
    });
    
    // Check loading state immediately after click
    expect(screen.getByRole('button', { name: 'Starting Game...' })).toBeDisabled();
    
    // Wait for promise to resolve
    act(() => {
      vi.advanceTimersByTime(100);
    });
  });

  it('shows loading state on start button', () => {
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    
    act(() => {
      fireEvent.click(startButton);
    });
    
    // Check loading state immediately after click
    expect(screen.getByRole('button', { name: 'Starting Game...' })).toBeInTheDocument();
    
    // Wait for promise to resolve
    act(() => {
      vi.advanceTimersByTime(100);
    });
  });
});