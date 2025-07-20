import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderLobby, resetMockHookState, mockAddGame } from './Lobby.testSetup';

describe('Lobby - Create Game Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('shows create game modal when button is clicked', async () => {
    renderLobby();
    
    const createButton = screen.getByText('Create Game');
    await userEvent.click(createButton);
    
    expect(screen.getByTestId('create-game-modal')).toBeInTheDocument();
  });

  it('hides create game modal when close button is clicked', async () => {
    renderLobby();
    
    // Open modal
    const createButton = screen.getByText('Create Game');
    await userEvent.click(createButton);
    
    // Close modal
    const closeButton = screen.getByTestId('close-modal-button');
    await userEvent.click(closeButton);
    
    expect(screen.queryByTestId('create-game-modal')).not.toBeInTheDocument();
  });

  it('creates a new game when form is submitted', async () => {
    renderLobby();
    
    // Open modal
    const createButton = screen.getByText('Create Game');
    await userEvent.click(createButton);
    
    // Submit form
    const submitButton = screen.getByTestId('create-game-button');
    await userEvent.click(submitButton);
    
    // Check if addGame was called with correct parameters
    expect(mockAddGame).toHaveBeenCalledTimes(1);
    expect(mockAddGame).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Test Game',
      status: 'waiting',
      playerCount: 0,
      maxPlayers: 4
    }));
    
    // Modal should be closed after submission
    expect(screen.queryByTestId('create-game-modal')).not.toBeInTheDocument();
  });
});