import type { Meta, StoryObj } from '@storybook/react';
import { GameCard } from './GameCard';
import type { LobbyGame } from '@/types/texas42';

const meta = {
  title: 'Lobby/GameCard',
  component: GameCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentUserId: {
      control: 'text',
      description: 'ID of the current user viewing the card',
    },
    onJoinGame: { action: 'joinGame' },
    onLeaveGame: { action: 'leaveGame' },
    onSpectateGame: { action: 'spectateGame' },
    onMarkReady: { action: 'markReady' },
  },
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base game data
const baseGame: LobbyGame = {
  id: 'game-1',
  name: 'Friday Night 42',
  playerCount: 2,
  maxPlayers: 4,
  status: 'waiting',
  createdAt: new Date().toISOString(),
  gameCode: 'ABC123',
  creator: 'player1',
};

export const WaitingForPlayers: Story = {
  args: {
    game: {
      ...baseGame,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: false },
      ],
    },
    currentUserId: 'player1',
  },
};

export const EmptyGame: Story = {
  args: {
    game: {
      ...baseGame,
      playerCount: 0,
      players: [],
    },
    currentUserId: 'viewer1',
  },
};

export const FullGame: Story = {
  args: {
    game: {
      ...baseGame,
      playerCount: 4,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: true },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
        { id: 'player4', name: 'Diana', position: 'west', isReady: true },
      ],
    },
    currentUserId: 'viewer1',
  },
};

export const GameInProgress: Story = {
  args: {
    game: {
      ...baseGame,
      status: 'playing',
      playerCount: 4,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: true },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
        { id: 'player4', name: 'Diana', position: 'west', isReady: true },
      ],
    },
    currentUserId: 'viewer1',
  },
};

export const FinishedGame: Story = {
  args: {
    game: {
      ...baseGame,
      status: 'finished',
      playerCount: 4,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: true },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
        { id: 'player4', name: 'Diana', position: 'west', isReady: true },
      ],
    },
    currentUserId: 'player1',
  },
};

export const CurrentPlayerInGame: Story = {
  args: {
    game: {
      ...baseGame,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'current-user', name: 'You', position: 'east', isReady: false },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
      ],
    },
    currentUserId: 'current-user',
  },
};

export const MixedReadyStates: Story = {
  args: {
    game: {
      ...baseGame,
      playerCount: 3,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: false },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
      ],
    },
    currentUserId: 'viewer1',
  },
};

export const LongGameName: Story = {
  args: {
    game: {
      ...baseGame,
      name: 'Super Long Game Name That Might Overflow The Card',
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
      ],
    },
    currentUserId: 'viewer1',
  },
};

export const NoPlayers: Story = {
  name: 'No Players (Mock Data)',
  args: {
    game: {
      ...baseGame,
      playerCount: 0,
      players: undefined, // This will trigger mock data in component
    },
    currentUserId: 'viewer1',
  },
};

export const SpectatorMode: Story = {
  args: {
    game: {
      ...baseGame,
      status: 'playing',
      playerCount: 4,
      players: [
        { id: 'player1', name: 'Alice', position: 'north', isReady: true },
        { id: 'player2', name: 'Bob', position: 'east', isReady: true },
        { id: 'player3', name: 'Charlie', position: 'south', isReady: true },
        { id: 'player4', name: 'Diana', position: 'west', isReady: true },
      ],
    },
    currentUserId: 'spectator1', // User not in the game
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the game card from a spectator\'s perspective - user can watch but not participate',
      },
    },
  },
};