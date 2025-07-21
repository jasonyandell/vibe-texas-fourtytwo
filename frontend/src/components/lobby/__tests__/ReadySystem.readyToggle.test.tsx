import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Ready Toggle Functionality', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  const mockHandlers = {
    onMarkReady: vi.fn(),
    onUnmarkReady: vi.fn(),
    onStartGame: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows ready button for current user', () => {
    render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByRole('button', { name: 'Mark yourself as ready to start the game' })).toBeInTheDocument();
  });

  it('calls onMarkReady when ready button is clicked', () => {
    render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    const readyButton = screen.getByRole('button', { name: 'Mark yourself as ready to start the game' });
    fireEvent.click(readyButton);
    
    expect(mockHandlers.onMarkReady).toHaveBeenCalledWith('test-game', 'p1');
  });

  it('shows "Not Ready" button when user is ready', () => {
    const readyPlayers = mockPlayers.map(p => 
      p?.id === 'p1' ? { ...p, isReady: true } : p
    );
    render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    expect(screen.getByRole('button', { name: 'Mark yourself as not ready' })).toBeInTheDocument();
  });

  it('calls onUnmarkReady when not ready button is clicked', () => {
    const readyPlayers = mockPlayers.map(p => 
      p?.id === 'p1' ? { ...p, isReady: true } : p
    );
    render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    const notReadyButton = screen.getByRole('button', { name: 'Mark yourself as not ready' });
    fireEvent.click(notReadyButton);
    
    expect(mockHandlers.onUnmarkReady).toHaveBeenCalledWith('test-game', 'p1');
  });

  it('hides ready button when no current user', () => {
    render(<ReadySystem players={mockPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.queryByRole('button', { name: /ready/i })).not.toBeInTheDocument();
  });

  it('disables ready toggle when starting', () => {
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
    render(<ReadySystem players={allReadyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    act(() => {
      fireEvent.click(startButton);
    });
    
    const readyButton = screen.getByRole('button', { name: 'Mark yourself as not ready' });
    expect(readyButton).toBeDisabled();
  });
});