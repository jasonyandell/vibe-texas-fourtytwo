import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { mockGames } from './LobbyList.fixtures';

describe('LobbyList - State Transitions', () => {
  it('transitions from loading to games display', () => {
    const { rerender } = render(<LobbyList games={[]} loading={true} />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
    
    rerender(<LobbyList games={mockGames} loading={false} />);
    
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });

  it('transitions from loading to empty state', () => {
    const { rerender } = render(<LobbyList games={[]} loading={true} />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
    
    rerender(<LobbyList games={[]} loading={false} />);
    
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    expect(screen.getByText('No games available')).toBeInTheDocument();
  });

  it('transitions from loading to error state', () => {
    const mockError = new Error('Load failed');
    const { rerender } = render(<LobbyList games={[]} loading={true} />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
    
    rerender(<LobbyList games={[]} loading={false} error={mockError} />);
    
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    expect(screen.getByText('Unable to load games')).toBeInTheDocument();
  });

  it('transitions from error to games display', () => {
    const mockError = new Error('Load failed');
    const { rerender } = render(<LobbyList games={[]} error={mockError} />);
    
    expect(screen.getByText('Unable to load games')).toBeInTheDocument();
    
    rerender(<LobbyList games={mockGames} error={null} />);
    
    expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });

  it('handles rapid state changes without errors', () => {
    const { rerender } = render(<LobbyList games={[]} loading={true} />);
    
    // Rapid state changes
    rerender(<LobbyList games={mockGames} loading={false} />);
    rerender(<LobbyList games={[]} loading={true} />);
    rerender(<LobbyList games={mockGames} loading={false} />);
    
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });
});