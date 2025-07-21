import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';

describe('LobbyList - Empty State', () => {
  it('shows empty state when no games are available', () => {
    render(<LobbyList games={[]} />);
    
    expect(screen.getByText('No games available')).toBeInTheDocument();
    expect(screen.getByText(/There are currently no active games/)).toBeInTheDocument();
  });

  it('shows empty state with create game prompt', () => {
    render(<LobbyList games={[]} />);
    
    expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
  });

  it('does not show empty state when loading', () => {
    render(<LobbyList games={[]} loading={true} />);
    
    expect(screen.queryByText('No games available')).not.toBeInTheDocument();
  });

  it('does not show empty state when error is present', () => {
    const mockError = new Error('Test error');
    render(<LobbyList games={[]} error={mockError} />);
    
    expect(screen.queryByText('No games available')).not.toBeInTheDocument();
  });

  it('handles empty games array', () => {
    render(<LobbyList games={[]} />);
    
    expect(screen.getByText('No games available')).toBeInTheDocument();
  });

  it('provides accessible empty state', () => {
    render(<LobbyList games={[]} />);
    
    const emptyHeading = screen.getByRole('heading', { name: 'No games available' });
    expect(emptyHeading).toBeInTheDocument();
  });
});