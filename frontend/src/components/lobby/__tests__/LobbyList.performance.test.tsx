import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { createManyGames } from './LobbyList.fixtures';

describe('LobbyList - Performance', () => {
  it('renders large number of games efficiently', () => {
    const manyGames = createManyGames(50);

    const startTime = performance.now();
    render(<LobbyList games={manyGames} />);
    const endTime = performance.now();

    // Should render within reasonable time (less than 1500ms)
    // Note: Test environments can be slower than production
    expect(endTime - startTime).toBeLessThan(1500);
    
    // Verify first and last games are rendered
    expect(screen.getByText('Game 0')).toBeInTheDocument();
    expect(screen.getByText('Game 49')).toBeInTheDocument();
  });
});