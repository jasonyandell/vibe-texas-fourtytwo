import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Ready Status Display', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  it('shows ready status header with count', () => {
    render(<ReadySystem players={mockPlayers} gameId="test-game" />);
    
    expect(screen.getByText('Ready Status')).toBeInTheDocument();
    expect(screen.getByText('0/4 Ready')).toBeInTheDocument();
  });

  it('updates ready count when players are ready', () => {
    const readyPlayers = mockPlayers.map((p, i) => 
      p ? { ...p, isReady: i < 2 } : null
    );
    render(<ReadySystem players={readyPlayers} gameId="test-game" />);
    
    expect(screen.getByText('2/4 Ready')).toBeInTheDocument();
  });

  it('displays all player ready states', () => {
    render(<ReadySystem players={mockPlayers} gameId="test-game" />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
    
    const notReadyBadges = screen.getAllByText('Not Ready');
    expect(notReadyBadges).toHaveLength(4);
  });

  it('highlights current user with "You" badge', () => {
    render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
  });
});