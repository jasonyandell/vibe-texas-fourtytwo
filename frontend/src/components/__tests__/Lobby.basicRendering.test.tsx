import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLobby, resetMockHookState } from './Lobby.testSetup';

describe('Lobby - Basic Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('renders the lobby header with title', () => {
    renderLobby();
    
    expect(screen.getByText('Texas 42 Lobby')).toBeInTheDocument();
  });

  it('displays the number of connected players', () => {
    renderLobby();
    
    expect(screen.getByText('42 players online')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderLobby();
    
    expect(screen.getByText('Create Game')).toBeInTheDocument();
    expect(screen.getByText('Join Random Game')).toBeInTheDocument();
  });

  it('renders filter and sort controls', () => {
    renderLobby();
    
    expect(screen.getByLabelText('Filter by status:')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
  });

  it('passes the correct props to LobbyList', () => {
    renderLobby();
    
    const gamesCount = screen.getByTestId('games-count');
    expect(gamesCount.textContent).toBe('4'); // All 4 mock games
  });
});