import type { Meta, StoryObj } from '@storybook/react';
import { GameBoardPlayers } from './GameBoardPlayers';
import { GameState, createEmptyGameState, Player, PlayerPosition } from '@texas42/shared-types';
import { createFullDominoSet } from '@/types/domino';

const meta = {
  title: 'Game/GameBoardPlayers',
  component: GameBoardPlayers,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['north', 'east', 'south', 'west'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '40px',
        backgroundColor: 'transparent',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameBoardPlayers>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a basic game state
const createBasicGameState = (overrides?: Partial<GameState>): GameState => {
  const state = createEmptyGameState('test-game-123');
  const { dominoes } = createFullDominoSet();
  
  // Create a full set of players
  const players: Player[] = [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: dominoes.slice(0, 7),
      isConnected: true,
      isReady: true,
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: dominoes.slice(7, 14),
      isConnected: true,
      isReady: true,
    },
    {
      id: 'player-3',
      name: 'Charlie',
      position: 'south',
      hand: dominoes.slice(14, 21),
      isConnected: true,
      isReady: true,
    },
    {
      id: 'player-4',
      name: 'Diana',
      position: 'west',
      hand: dominoes.slice(21, 28),
      isConnected: true,
      isReady: true,
    },
  ];
  
  state.players = players;
  state.dealer = 'player-1';
  state.currentPlayer = 'player-2';
  state.phase = 'playing';
  
  return { ...state, ...overrides };
};

/**
 * Display all four player positions in a grid
 */
export const AllPositions: Story = {
  args: {
    position: 'north',
    gameState: createBasicGameState(),
    currentPlayerId: 'player-3',
  },
  render: () => {
    const gameState = createBasicGameState();
    const positions: PlayerPosition[] = ['north', 'east', 'south', 'west'];
    
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        width: '800px'
      }}>
        {positions.map((position) => (
          <div key={position} style={{ textAlign: 'center' }}>
            <h3>{position.toUpperCase()}</h3>
            <GameBoardPlayers
              position={position}
              gameState={gameState}
              currentPlayerId="player-3"
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Active player with highlighted state
 */
export const ActivePlayer: Story = {
  args: {
    position: 'east',
    gameState: createBasicGameState({
      currentPlayer: 'player-2', // Bob is east
      phase: 'playing',
    }),
    currentPlayerId: 'player-2',
  },
};

/**
 * Player showing domino count (face down for opponents)
 */
export const WithDominoCount: Story = {
  args: {
    position: 'south',
    gameState: createBasicGameState(),
    currentPlayerId: 'player-3',
  },
  render: () => {
    const gameState = createBasicGameState();
    
    return (
      <div style={{ display: 'flex', gap: '40px' }}>
        <div>
          <h3>Your Hand (South)</h3>
          <GameBoardPlayers
            position="south"
            gameState={gameState}
            currentPlayerId="player-3" // You are Charlie (south)
          />
        </div>
        <div>
          <h3>Opponent's Hand (North)</h3>
          <GameBoardPlayers
            position="north"
            gameState={gameState}
            currentPlayerId="player-3" // You are Charlie, viewing Alice's hand
          />
        </div>
      </div>
    );
  },
};

/**
 * Disconnected player (grayed out)
 */
export const Disconnected: Story = {
  args: {
    position: 'west',
    gameState: (() => {
      const state = createBasicGameState();
      // Disconnect Diana (west)
      state.players[3] = { ...state.players[3], isConnected: false };
      return state;
    })(),
    currentPlayerId: 'player-1',
  },
};

/**
 * Dealer badge display
 */
export const DealerPlayer: Story = {
  args: {
    position: 'north',
    gameState: createBasicGameState({
      dealer: 'player-1', // Alice is dealer
    }),
    currentPlayerId: 'player-3',
  },
};

/**
 * Current bidder during bidding phase
 */
export const CurrentBidder: Story = {
  args: {
    position: 'east',
    gameState: createBasicGameState({
      phase: 'bidding',
      currentPlayer: 'player-2', // Bob is current bidder
    }),
    currentPlayerId: 'player-3',
  },
};

/**
 * Empty position (waiting for player)
 */
export const WaitingForPlayer: Story = {
  args: {
    position: 'west',
    gameState: (() => {
      const state = createBasicGameState();
      // Remove west player
      state.players = state.players.filter(p => p.position !== 'west');
      return state;
    })(),
    currentPlayerId: 'player-1',
  },
};

/**
 * Partnership highlighting (North-South vs East-West)
 */
export const Partnerships: Story = {
  args: {
    position: 'north',
    gameState: createBasicGameState(),
    currentPlayerId: 'player-1',
  },
  render: () => {
    const gameState = createBasicGameState();
    
    return (
      <div>
        <h3>Texas 42 Partnerships</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '250px 250px 250px',
          gridTemplateRows: 'auto auto auto',
          gap: '20px',
          width: '800px',
          margin: '20px auto'
        }}>
          <div />
          <GameBoardPlayers
            position="north"
            gameState={gameState}
            currentPlayerId="player-1"
          />
          <div />
          
          <GameBoardPlayers
            position="west"
            gameState={gameState}
            currentPlayerId="player-1"
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            lineHeight: '1.5',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>
              <span style={{ color: '#2196f3' }}>North-South</span>
              <br />vs<br />
              <span style={{ color: '#ff9800' }}>East-West</span>
            </div>
          </div>
          <GameBoardPlayers
            position="east"
            gameState={gameState}
            currentPlayerId="player-1"
          />
          
          <div />
          <GameBoardPlayers
            position="south"
            gameState={gameState}
            currentPlayerId="player-1"
          />
          <div />
        </div>
      </div>
    );
  },
};

/**
 * Spectator mode - all hands visible
 */
export const SpectatorView: Story = {
  args: {
    position: 'north',
    gameState: createBasicGameState(),
    isSpectatorMode: true,
  },
};

/**
 * Interactive hand - clicking dominoes
 */
export const InteractiveHand: Story = {
  args: {
    position: 'south',
    gameState: createBasicGameState({
      currentPlayer: 'player-3', // Your turn
      phase: 'playing',
    }),
    currentPlayerId: 'player-3',
    onDominoPlay: (dominoId) => console.log('Clicked domino:', dominoId),
  },
};