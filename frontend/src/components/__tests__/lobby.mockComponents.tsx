import React from 'react';
import { vi } from 'vitest';
import { LobbyGame } from '@/types/texas42';
import { mockHookState } from './lobby.mockFunctions';

// Mock the hooks
vi.mock('@/hooks/useLobbyState', () => ({
  useLobbyState: vi.fn().mockImplementation(() => mockHookState)
}));

// Mock the LobbyList component
vi.mock('../lobby/LobbyList', () => ({
  LobbyList: vi.fn(({ games, loading, error }: { games: LobbyGame[]; loading: boolean; error: Error | null }) => (
    <div data-testid="lobby-list">
      <div data-testid="games-count">{games.length}</div>
      {loading && <div data-testid="loading-indicator">Loading...</div>}
      {error && <div data-testid="error-message">{error.message}</div>}
    </div>
  ))
}));

// Mock the CreateGameModal component
vi.mock('../lobby/CreateGameModal', () => ({
  CreateGameModal: vi.fn(({ onCreateGame, onClose }: { onCreateGame: (name: string) => void; onClose: () => void }) => (
    <div data-testid="create-game-modal">
      <button 
        data-testid="create-game-button" 
        onClick={() => onCreateGame('New Test Game')}
      >
        Create
      </button>
      <button 
        data-testid="close-modal-button" 
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ))
}));

// Mock the Button component
vi.mock('@/components/ui', () => ({
  Button: vi.fn(({ children, onClick, disabled, variant, size }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    variant?: string; 
    size?: string 
  }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid={`button-${variant || 'default'}${size ? `-${size}` : ''}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  ))
}));