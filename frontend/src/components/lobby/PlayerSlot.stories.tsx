import type { Meta, StoryObj } from '@storybook/react';
import { PlayerSlot } from './PlayerSlot';
import type { Player } from './types';
import { useState } from 'react';

const meta = {
  title: 'Lobby/PlayerSlot',
  component: PlayerSlot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['North', 'East', 'South', 'West'],
    },
    gameStatus: {
      control: 'select',
      options: ['waiting', 'playing', 'finished'],
    },
    onJoinSlot: { action: 'joinSlot' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePlayer: Player = {
  id: 'player1',
  name: 'Alice',
  position: 'north',
  isReady: false,
};

export const EmptySlotWaiting: Story = {
  args: {
    player: null,
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
};

export const EmptySlotPlaying: Story = {
  args: {
    player: null,
    index: 0,
    position: 'North',
    gameStatus: 'playing',
    currentUserId: 'viewer1',
  },
};

export const OccupiedNotReady: Story = {
  args: {
    player: samplePlayer,
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
};

export const OccupiedReady: Story = {
  args: {
    player: {
      ...samplePlayer,
      isReady: true,
    },
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
};

export const CurrentUserNotReady: Story = {
  args: {
    player: {
      ...samplePlayer,
      id: 'current-user',
      name: 'You',
    },
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'current-user',
  },
};

export const CurrentUserReady: Story = {
  args: {
    player: {
      ...samplePlayer,
      id: 'current-user',
      name: 'You',
      isReady: true,
    },
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'current-user',
  },
};

export const LongPlayerName: Story = {
  args: {
    player: {
      ...samplePlayer,
      name: 'VeryLongPlayerNameThatMightOverflow',
    },
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
};

export const DuringGame: Story = {
  args: {
    player: {
      ...samplePlayer,
      isReady: true,
    },
    index: 0,
    position: 'North',
    gameStatus: 'playing',
    currentUserId: 'viewer1',
  },
};

export const AfterGame: Story = {
  args: {
    player: samplePlayer,
    index: 0,
    position: 'North',
    gameStatus: 'finished',
    currentUserId: 'viewer1',
  },
};

export const Disconnected: Story = {
  args: {
    player: {
      ...samplePlayer,
      isReady: false,
      // In a real implementation, disconnected state might be indicated by a property
      // For now, we'll simulate it visually
    },
    index: 0,
    position: 'North',
    gameStatus: 'playing',
    currentUserId: 'viewer1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a player slot when the player has disconnected during the game. In a real implementation, this might show a different visual state or icon.',
      },
    },
  },
};

export const AllPositions: Story = {
  args: {
    player: null,
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
  render: () => {
    const positions = ['North', 'East', 'South', 'West'];
    const players: (Player | null)[] = [
      { id: '1', name: 'Alice', position: 'north', isReady: true },
      { id: '2', name: 'Bob', position: 'east', isReady: false },
      null,
      { id: '4', name: 'Diana', position: 'west', isReady: true },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '600px' }}>
        {positions.map((position, index) => (
          <PlayerSlot
            key={position}
            player={players[index]}
            index={index}
            position={position}
            gameStatus="waiting"
            currentUserId="viewer1"
            onJoinSlot={(idx) => console.log(`Join slot ${idx}`)}
          />
        ))}
      </div>
    );
  },
};

export const Interactive: Story = {
  args: {
    player: null,
    index: 0,
    position: 'North',
    gameStatus: 'waiting',
    currentUserId: 'viewer1',
  },
  render: function InteractiveStory() {
    const [players, setPlayers] = useState<(Player | null)[]>([
      { id: '1', name: 'Alice', position: 'north', isReady: true },
      null,
      { id: '3', name: 'Charlie', position: 'south', isReady: false },
      null,
    ]);

    const handleJoinSlot = (index: number) => {
      const newPlayers = [...players];
      newPlayers[index] = {
        id: 'current-user',
        name: 'You',
        position: (['north', 'east', 'south', 'west'] as const)[index],
        isReady: false,
      };
      setPlayers(newPlayers);
    };

    return (
      <div style={{ width: '300px' }}>
        <h3>Click empty slots to join:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['North', 'East', 'South', 'West'].map((position, index) => (
            <PlayerSlot
              key={position}
              player={players[index]}
              index={index}
              position={position}
              gameStatus="waiting"
              currentUserId="current-user"
              onJoinSlot={handleJoinSlot}
            />
          ))}
        </div>
      </div>
    );
  },
};