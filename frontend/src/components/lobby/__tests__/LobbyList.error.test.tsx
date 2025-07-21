import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { mockGames } from './LobbyList.fixtures';

describe('LobbyList - Error State', () => {
  const mockError = new Error('Failed to load games');

  it('shows error message when error is provided', () => {
    render(<LobbyList games={[]} error={mockError} />);
    
    expect(screen.getByText('Unable to load games')).toBeInTheDocument();
    expect(screen.getByText('Failed to load games')).toBeInTheDocument();
    expect(screen.getByText('Please try refreshing the page.')).toBeInTheDocument();
  });

  it('does not show games when error is present', () => {
    render(<LobbyList games={mockGames} error={mockError} />);
    
    expect(screen.queryByText('Test Game 1')).not.toBeInTheDocument();
    expect(screen.getByText('Unable to load games')).toBeInTheDocument();
  });

  it('prioritizes error over loading state', () => {
    render(<LobbyList games={[]} loading={true} error={mockError} />);
    
    expect(screen.getByText('Unable to load games')).toBeInTheDocument();
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to error state', () => {
    render(<LobbyList games={[]} error={mockError} />);
    
    const errorState = screen.getByTestId('error-state');
    expect(errorState).toBeInTheDocument();
  });

  it('provides accessible error state', () => {
    render(<LobbyList games={[]} error={mockError} />);
    
    const errorHeading = screen.getByRole('heading', { name: 'Unable to load games' });
    expect(errorHeading).toBeInTheDocument();
  });
});