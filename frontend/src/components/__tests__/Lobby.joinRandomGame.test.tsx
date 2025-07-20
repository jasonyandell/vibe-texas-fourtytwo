import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderLobby, resetMockHookState, mockGetJoinableGames } from './Lobby.testSetup';

describe('Lobby - Join Random Game Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('enables join random game button when joinable games exist', () => {
    renderLobby();
    
    const joinRandomButton = screen.getByText('Join Random Game');
    expect(joinRandomButton).not.toBeDisabled();
  });

  it('disables join random game button when no joinable games exist', () => {
    // Override the mock for this test
    mockGetJoinableGames.mockReturnValueOnce([]);
    
    renderLobby();
    
    const joinRandomButton = screen.getByText('Join Random Game');
    expect(joinRandomButton).toBeDisabled();
  });

  it('calls console.log when join random game is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    renderLobby();
    
    const joinRandomButton = screen.getByText('Join Random Game');
    await userEvent.click(joinRandomButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Joining random game:', expect.any(Object));
    
    consoleSpy.mockRestore();
  });
});