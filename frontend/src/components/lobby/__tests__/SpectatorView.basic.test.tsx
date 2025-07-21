import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpectatorView } from '../SpectatorView';
import { mockGameState, mockSpectators } from './SpectatorView.test-fixtures';
import { mockHandlers } from './SpectatorView.test-utils';
import './SpectatorView.test-utils';

describe('SpectatorView - Basic Rendering', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spectator view with game information', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByText('Spectating: test-game-1')).toBeInTheDocument();
    expect(screen.getByText('Phase: playing')).toBeInTheDocument();
    expect(screen.getByText('Current: Alice')).toBeInTheDocument();
  });

  it('renders all player hands', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('shows player connection status', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    // Three players are connected (Alice, Bob, Dave) and one disconnected (Carol)
    const connectedBadges = screen.getAllByText('Connected');
    expect(connectedBadges).toHaveLength(3);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('displays hand counts for each player', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    // Each player shows their domino count - getAllByText will find all instances
    const twoDominoes = screen.getAllByText('2 dominoes');
    expect(twoDominoes.length).toBeGreaterThanOrEqual(2); // At least Alice and Bob
    
    const oneDomino = screen.getAllByText('1 domino');
    expect(oneDomino.length).toBeGreaterThanOrEqual(1); // At least Carol
    
    const threeDominoes = screen.getAllByText('3 dominoes');
    expect(threeDominoes.length).toBeGreaterThanOrEqual(1); // At least Dave
  });
});