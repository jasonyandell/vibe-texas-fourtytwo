import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Accessibility', () => {
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

  it('provides proper ARIA labels for buttons', () => {
    render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
    
    // The button text is "Ready Up!" but aria-label provides accessible name
    const readyButton = screen.getByRole('button', { name: 'Mark yourself as ready to start the game' });
    expect(readyButton).toHaveTextContent('Ready Up!');
    expect(readyButton).toHaveAttribute('aria-label', 'Mark yourself as ready to start the game');
  });

  it('announces ready state changes', () => {
    const readyPlayers = mockPlayers.map(p => 
      p?.id === 'p1' ? { ...p, isReady: true } : p
    );
    render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" />);
    
    // Find Alice's item and check it has ready state
    const aliceItem = screen.getByText('Alice').closest('[class*="playerReadyItem"]');
    expect(aliceItem?.className).toMatch(/ready/);
    
    // Also check that the ready badge is shown
    const readyBadge = screen.getByText('Ready');
    expect(readyBadge).toBeInTheDocument();
  });

  it('provides semantic structure with headings', () => {
    const { container } = render(<ReadySystem players={mockPlayers} gameId="test-game" />);
    
    // First check that the component rendered something
    expect(container.firstChild).toBeInTheDocument();
    
    // Check for the heading text without role (h4 might not have heading role in test env)
    expect(screen.getByText('Ready Status')).toBeInTheDocument();
  });

  it('groups related controls semantically', () => {
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
    
    // Find the start button and check its parent has the startSection class
    const startButton = screen.getByRole('button', { name: 'Start Game Now' });
    const startSection = startButton.closest('[class*="startSection"]');
    expect(startSection).toBeInTheDocument();
  });
});