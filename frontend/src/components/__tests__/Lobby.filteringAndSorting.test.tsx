import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderLobby, resetMockHookState, mockGetSortedGames } from './Lobby.testSetup';

describe('Lobby - Filtering and Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('filters games by status', async () => {
    renderLobby();
    
    // Initially shows all games
    expect(screen.getByTestId('games-count').textContent).toBe('4');
    
    // Change filter to 'waiting'
    const filterSelect = screen.getByLabelText('Filter by status:');
    await userEvent.selectOptions(filterSelect, 'waiting');
    
    // Should now show only waiting games (2 of them)
    expect(screen.getByTestId('games-count').textContent).toBe('2');
    
    // Change filter to 'playing'
    await userEvent.selectOptions(filterSelect, 'playing');
    
    // Should now show only playing games (1 of them)
    expect(screen.getByTestId('games-count').textContent).toBe('1');
    
    // Change filter to 'finished'
    await userEvent.selectOptions(filterSelect, 'finished');
    
    // Should now show only finished games (1 of them)
    expect(screen.getByTestId('games-count').textContent).toBe('1');
  });

  it('sorts games by different criteria', async () => {
    renderLobby();
    
    // Default sort is 'newest'
    expect(mockGetSortedGames).toHaveBeenCalledWith('newest');
    
    // Change sort to 'oldest'
    const sortSelect = screen.getByLabelText('Sort by:');
    await userEvent.selectOptions(sortSelect, 'oldest');
    
    expect(mockGetSortedGames).toHaveBeenCalledWith('oldest');
    
    // Change sort to 'playerCount'
    await userEvent.selectOptions(sortSelect, 'playerCount');
    
    expect(mockGetSortedGames).toHaveBeenCalledWith('playerCount');
    
    // Change sort to 'name'
    await userEvent.selectOptions(sortSelect, 'name');
    
    expect(mockGetSortedGames).toHaveBeenCalledWith('name');
  });
});