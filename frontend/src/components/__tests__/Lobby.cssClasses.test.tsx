import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLobby, resetMockHookState } from './Lobby.testSetup';

describe('Lobby - CSS Classes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('applies gamesSection CSS class to games container', () => {
    renderLobby();
    
    // Find the element containing "Available Games" heading
    const heading = screen.getByText('Available Games');
    const gamesSection = heading.parentElement;
    
    // Check that the parent element exists and has the appropriate class
    expect(gamesSection).toBeInTheDocument();
    expect(gamesSection?.className).toMatch(/gamesSection/);
  });
});