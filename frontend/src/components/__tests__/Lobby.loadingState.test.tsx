import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLobby, resetMockHookState, mockHookState } from './Lobby.testSetup';

describe('Lobby - Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('disables create game button when loading', () => {
    // Override the mock for this test
    mockHookState.isLoading = true;
    
    renderLobby();
    
    const createButton = screen.getByText('Create Game');
    expect(createButton).toBeDisabled();
  });

  it('passes loading state to LobbyList', () => {
    // Override the mock for this test
    mockHookState.isLoading = true;
    
    renderLobby();
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});