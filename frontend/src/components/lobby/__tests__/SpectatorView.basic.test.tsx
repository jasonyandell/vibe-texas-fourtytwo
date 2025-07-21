import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestProviders } from '@/test/test-providers';
import { SpectatorView } from '../SpectatorView';
import { mockGameState, mockSpectators } from './SpectatorView.test-fixtures';
import './SpectatorView.test-utils';

describe('SpectatorView - Basic Rendering', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spectator view with game information', () => {
    render(
      <TestProviders>
        <SpectatorView gameState={mockGameState} spectators={mockSpectators} />
      </TestProviders>
    );
    
    expect(screen.getByText('Spectating: test-game-1')).toBeInTheDocument();
    expect(screen.getByText('Phase: playing')).toBeInTheDocument();
    expect(screen.getByText('Current: Alice')).toBeInTheDocument();
  });

  it('renders all player hands', () => {
    render(
      <TestProviders>
        <SpectatorView gameState={mockGameState} spectators={mockSpectators} />
      </TestProviders>
    );
    
    expect(screen.getAllByText('Alice')).toHaveLength(2); // Name appears in header and player list
    expect(screen.getAllByText('Bob')).toHaveLength(2); // Name appears in select and player list
    expect(screen.getAllByText('Carol')).toHaveLength(2); // Name appears in select and player list  
    expect(screen.getAllByText('Dave')).toHaveLength(2); // Name appears in select and player list
  });

  it('shows player connection status', () => {
    render(
      <TestProviders>
        <SpectatorView gameState={mockGameState} spectators={mockSpectators} />
      </TestProviders>
    );
    
    // Three players are connected (Alice, Bob, Dave) and one disconnected (Carol)
    const connectedBadges = screen.getAllByText('Connected');
    expect(connectedBadges).toHaveLength(3);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('displays hand counts for each player', () => {
    render(
      <TestProviders>
        <SpectatorView gameState={mockGameState} spectators={mockSpectators} />
      </TestProviders>
    );
    
    // Each player shows their domino count - getAllByText will find all instances
    const twoDominoes = screen.getAllByText('2 dominoes');
    expect(twoDominoes.length).toBeGreaterThanOrEqual(2); // At least Alice and Bob
    
    const oneDomino = screen.getAllByText('1 domino');
    expect(oneDomino.length).toBeGreaterThanOrEqual(1); // At least Carol
    
    const threeDominoes = screen.getAllByText('3 dominoes');
    expect(threeDominoes.length).toBeGreaterThanOrEqual(1); // At least Dave
  });
});