import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStartManager } from '../GameStartManager';
import { Player } from '@/types/texas42';

describe('GameStartManager - Player Status', () => {
  const mockFullReadyPlayers: (Player | null)[] = [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'Carol',
      position: 'south',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-4',
      name: 'Dave',
      position: 'west',
      hand: [],
      isConnected: true,
      isReady: true
    }
  ];

  describe('Player Status Display', () => {
    it('shows ready breakdown when game is full', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
      expect(screen.getByText('Dave')).toBeInTheDocument();
    });

    it('shows ready indicators for each player', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const readyIndicators = screen.getAllByText('✓');
      expect(readyIndicators).toHaveLength(4);
    });

    it('shows not ready indicators for unready players', () => {
      const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
        p && i === 1 ? { ...p, isReady: false } : p
      );
      
      render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
      
      expect(screen.getByText('○')).toBeInTheDocument(); // Not ready indicator
      expect(screen.getAllByText('✓')).toHaveLength(3); // Ready indicators
    });

    it('applies correct CSS classes to ready players', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const aliceStatus = screen.getByTestId('player-status-player-1');
      expect(aliceStatus).toBeInTheDocument();
      // Check that ready indicator is shown
      expect(aliceStatus).toHaveTextContent('✓');
    });

    it('applies correct CSS classes to not ready players', () => {
      const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
        p && i === 1 ? { ...p, isReady: false } : p
      );
      
      render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
      
      const bobStatus = screen.getByTestId('player-status-player-2');
      expect(bobStatus).toBeInTheDocument();
      // Check that not ready indicator is shown
      expect(bobStatus).toHaveTextContent('○');
    });
  });
});