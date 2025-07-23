import type { Meta, StoryObj } from '@storybook/react';
import { GameStatus } from './GameStatus';
import { useState } from 'react';

const meta = {
  title: 'Lobby/GameStatus',
  component: GameStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['waiting', 'playing', 'finished'],
    },
    playerCount: {
      control: { type: 'number', min: 0, max: 4 },
    },
    maxPlayers: {
      control: { type: 'number', min: 1, max: 4 },
    },
    currentHand: {
      control: { type: 'number', min: 1, max: 7 },
    },
    totalHands: {
      control: { type: 'number', min: 1, max: 7 },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingEmpty: Story = {
  args: {
    status: 'waiting',
    playerCount: 0,
    maxPlayers: 4,
  },
};

export const WaitingPartial: Story = {
  args: {
    status: 'waiting',
    playerCount: 2,
    maxPlayers: 4,
  },
};

export const WaitingAlmostFull: Story = {
  args: {
    status: 'waiting',
    playerCount: 3,
    maxPlayers: 4,
  },
};

export const WaitingFull: Story = {
  args: {
    status: 'waiting',
    playerCount: 4,
    maxPlayers: 4,
  },
};

export const PlayingEarly: Story = {
  args: {
    status: 'playing',
    currentHand: 1,
    totalHands: 7,
  },
};

export const PlayingMidGame: Story = {
  args: {
    status: 'playing',
    currentHand: 4,
    totalHands: 7,
  },
};

export const PlayingLastHand: Story = {
  args: {
    status: 'playing',
    currentHand: 7,
    totalHands: 7,
  },
};

export const PlayingNoHandInfo: Story = {
  args: {
    status: 'playing',
  },
};

export const Finished: Story = {
  args: {
    status: 'finished',
  },
};

// Note: The plan mentioned 'Bidding' as a state, but the GameStatus component
// currently only supports 'waiting', 'playing', and 'finished' states.
// Bidding might be handled as part of the 'playing' state with additional context.

export const AllStates: Story = {
  args: {
    status: 'waiting',
    playerCount: 0,
    maxPlayers: 4,
  },
  render: () => {
    const states = [
      { title: 'Waiting (Empty)', props: { status: 'waiting' as const, playerCount: 0, maxPlayers: 4 } },
      { title: 'Waiting (Half Full)', props: { status: 'waiting' as const, playerCount: 2, maxPlayers: 4 } },
      { title: 'Playing (Hand 3/7)', props: { status: 'playing' as const, currentHand: 3, totalHands: 7 } },
      { title: 'Finished', props: { status: 'finished' as const } },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {states.map((state, index) => (
          <div key={index}>
            <h3 style={{ marginBottom: '12px' }}>{state.title}</h3>
            <GameStatus {...state.props} />
          </div>
        ))}
      </div>
    );
  },
};

export const Interactive: Story = {
  args: {
    status: 'waiting',
    playerCount: 0,
    maxPlayers: 4,
  },
  render: function InteractiveStory() {
    const [gameState, setGameState] = useState<{
      status: 'waiting' | 'playing' | 'finished';
      playerCount: number;
      currentHand: number;
    }>({
      status: 'waiting',
      playerCount: 0,
      currentHand: 1,
    });

    const addPlayer = () => {
      if (gameState.playerCount < 4) {
        setGameState(prev => ({ ...prev, playerCount: prev.playerCount + 1 }));
      }
    };

    const removePlayer = () => {
      if (gameState.playerCount > 0) {
        setGameState(prev => ({ ...prev, playerCount: prev.playerCount - 1 }));
      }
    };

    const startGame = () => {
      if (gameState.playerCount === 4) {
        setGameState(prev => ({ ...prev, status: 'playing' }));
      }
    };

    const nextHand = () => {
      if (gameState.currentHand < 7) {
        setGameState(prev => ({ ...prev, currentHand: prev.currentHand + 1 }));
      } else {
        setGameState(prev => ({ ...prev, status: 'finished' }));
      }
    };

    const resetGame = () => {
      setGameState({ status: 'waiting', playerCount: 0, currentHand: 1 });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
        <GameStatus
          status={gameState.status}
          playerCount={gameState.playerCount}
          maxPlayers={4}
          currentHand={gameState.status === 'playing' ? gameState.currentHand : undefined}
          totalHands={gameState.status === 'playing' ? 7 : undefined}
        />
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {gameState.status === 'waiting' && (
            <>
              <button onClick={addPlayer} disabled={gameState.playerCount >= 4}>
                Add Player
              </button>
              <button onClick={removePlayer} disabled={gameState.playerCount === 0}>
                Remove Player
              </button>
              <button onClick={startGame} disabled={gameState.playerCount !== 4}>
                Start Game
              </button>
            </>
          )}
          
          {gameState.status === 'playing' && (
            <button onClick={nextHand}>
              {gameState.currentHand < 7 ? 'Next Hand' : 'Finish Game'}
            </button>
          )}
          
          {gameState.status === 'finished' && (
            <button onClick={resetGame}>New Game</button>
          )}
        </div>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p>Status: {gameState.status}</p>
          {gameState.status === 'waiting' && (
            <p>Players: {gameState.playerCount}/4</p>
          )}
          {gameState.status === 'playing' && (
            <p>Hand: {gameState.currentHand}/7</p>
          )}
        </div>
      </div>
    );
  },
};

export const CustomStyling: Story = {
  args: {
    status: 'playing',
    currentHand: 3,
    totalHands: 7,
  },
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
          <h4>Light Background</h4>
          <GameStatus status="playing" currentHand={3} totalHands={7} />
        </div>
        <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ color: 'white' }}>Dark Background</h4>
          <GameStatus status="playing" currentHand={3} totalHands={7} />
        </div>
      </div>
    );
  },
};