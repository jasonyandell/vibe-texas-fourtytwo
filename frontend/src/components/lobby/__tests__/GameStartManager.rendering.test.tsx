import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStartManager } from '../GameStartManager';
import { Player } from '@/types/texas42';

describe('GameStartManager - Rendering', () => {
  const mockPlayers: (Player | null)[] = [
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
      isReady: false
    },
    {
      id: 'player-3',
      name: 'Carol',
      position: 'south',
      hand: [],
      isConnected: true,
      isReady: true
    },
    null // Empty slot
  ];

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

  describe('Basic Rendering', () => {
    it('renders game status section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByText('Game Status')).toBeInTheDocument();
    });

    it('shows player count badge', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByText('3/4 Players')).toBeInTheDocument();
    });

    it('shows start game button', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByRole('button', { name: /Need 1 More Players/ })).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const container = screen.getByTestId('game-start-manager');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to status section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const statusSection = screen.getByTestId('status-section');
      expect(statusSection).toBeInTheDocument();
    });

    it('applies correct CSS classes to ready grid', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const readyGrid = screen.getByTestId('ready-grid');
      expect(readyGrid).toBeInTheDocument();
    });

    it('applies correct CSS classes to action section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const actionSection = screen.getByTestId('action-section');
      expect(actionSection).toBeInTheDocument();
    });
  });
});