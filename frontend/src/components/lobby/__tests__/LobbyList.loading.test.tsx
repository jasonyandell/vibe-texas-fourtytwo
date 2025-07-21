import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { mockGames } from './LobbyList.fixtures';

describe('LobbyList - Loading State', () => {
  it('shows loading spinner when loading is true', () => {
    render(<LobbyList games={[]} loading={true} />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('shows loading message with proper accessibility', () => {
    render(<LobbyList games={[]} loading={true} />);
    
    const loadingMessage = screen.getByText('Loading games...');
    expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('does not show games when loading', () => {
    render(<LobbyList games={mockGames} loading={true} />);
    
    expect(screen.queryByText('Test Game 1')).not.toBeInTheDocument();
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
  });

  it('provides accessible loading state', () => {
    render(<LobbyList games={[]} loading={true} />);
    
    const loadingMessage = screen.getByText('Loading games...');
    expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
  });
});