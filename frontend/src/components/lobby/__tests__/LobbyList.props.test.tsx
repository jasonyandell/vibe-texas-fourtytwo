import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { mockGames } from './LobbyList.fixtures';

describe('LobbyList - Props Handling', () => {
  it('handles undefined loading prop', () => {
    render(<LobbyList games={mockGames} />);
    
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });

  it('handles undefined error prop', () => {
    render(<LobbyList games={mockGames} />);
    
    expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });

  it('handles null error prop', () => {
    render(<LobbyList games={mockGames} error={null} />);
    
    expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });
});