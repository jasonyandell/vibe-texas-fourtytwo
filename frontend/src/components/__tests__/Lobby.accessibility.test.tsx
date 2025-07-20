import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLobby, resetMockHookState } from './Lobby.testSetup';

describe('Lobby - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockHookState();
  });

  it('has proper labels for form controls', () => {
    renderLobby();
    
    expect(screen.getByLabelText('Filter by status:')).toHaveAttribute('id', 'status-filter');
    expect(screen.getByLabelText('Sort by:')).toHaveAttribute('id', 'sort-select');
  });

  it('has semantic structure with headings', () => {
    renderLobby();
    
    expect(screen.getByRole('heading', { name: 'Texas 42 Lobby' })).toBeInTheDocument();
  });

  it('has proper button labels', () => {
    renderLobby();
    
    const createButton = screen.getByText('Create Game');
    const joinRandomButton = screen.getByText('Join Random Game');
    
    expect(createButton).toBeInTheDocument();
    expect(joinRandomButton).toBeInTheDocument();
  });
});