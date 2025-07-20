import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderLobby, resetMockHookState, mockHookState, mockClearError } from './Lobby.testSetup';

describe('Lobby - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('displays error message when error exists', () => {
    // Override the mock for this test
    mockHookState.error = new Error('Test error message');
    
    renderLobby();
    
    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    
    // Click dismiss button
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });

  it('does not display error message when no error exists', () => {
    renderLobby();
    
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});