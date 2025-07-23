import type { Meta, StoryObj } from '@storybook/react';
import { ScoreDisplay } from './ScoreDisplay';
import { useState } from 'react';

const meta = {
  title: 'Lobby/ScoreDisplay',
  component: ScoreDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxScore: {
      control: { type: 'number', min: 1, max: 250 },
      description: 'Maximum score to win the game',
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether to show progress bars',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scores: {
      northSouth: 3,
      eastWest: 1,
    },
  },
};

export const Tied: Story = {
  args: {
    scores: {
      northSouth: 2,
      eastWest: 2,
    },
  },
};

export const NorthSouthLeading: Story = {
  args: {
    scores: {
      northSouth: 5,
      eastWest: 2,
    },
  },
};

export const EastWestLeading: Story = {
  args: {
    scores: {
      northSouth: 1,
      eastWest: 4,
    },
  },
};

export const CloseToWinning: Story = {
  args: {
    scores: {
      northSouth: 6,
      eastWest: 5,
    },
    maxScore: 7,
  },
};

export const GameComplete: Story = {
  args: {
    scores: {
      northSouth: 7,
      eastWest: 5,
    },
    maxScore: 7,
  },
};

export const HighScores: Story = {
  args: {
    scores: {
      northSouth: 225,
      eastWest: 180,
    },
    maxScore: 250,
  },
};

export const NoProgress: Story = {
  args: {
    scores: {
      northSouth: 3,
      eastWest: 1,
    },
    showProgress: false,
  },
};

export const ZeroScores: Story = {
  args: {
    scores: {
      northSouth: 0,
      eastWest: 0,
    },
  },
};

export const CustomMaxScore: Story = {
  args: {
    scores: {
      northSouth: 45,
      eastWest: 38,
    },
    maxScore: 100,
  },
};

export const Interactive: Story = {
  args: {
    scores: { northSouth: 0, eastWest: 0 },
    maxScore: 7,
    showProgress: true,
  },
  render: function InteractiveStory() {
    const [scores, setScores] = useState({ northSouth: 0, eastWest: 0 });
    const maxScore = 7;

    const addScore = (team: 'northSouth' | 'eastWest', points: number) => {
      setScores(prev => ({
        ...prev,
        [team]: Math.min(prev[team] + points, maxScore),
      }));
    };

    const resetScores = () => {
      setScores({ northSouth: 0, eastWest: 0 });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
        <ScoreDisplay scores={scores} maxScore={maxScore} />
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <div>
            <h4>North-South</h4>
            <button onClick={() => addScore('northSouth', 1)}>+1</button>
            <button onClick={() => addScore('northSouth', 5)}>+5</button>
          </div>
          <div>
            <h4>East-West</h4>
            <button onClick={() => addScore('eastWest', 1)}>+1</button>
            <button onClick={() => addScore('eastWest', 5)}>+5</button>
          </div>
        </div>
        
        <button onClick={resetScores}>Reset Game</button>
      </div>
    );
  },
};

export const AllStates: Story = {
  args: {
    scores: { northSouth: 0, eastWest: 0 },
    maxScore: 7,
    showProgress: true,
  },
  render: () => {
    const scenarios = [
      { title: 'Game Start', scores: { northSouth: 0, eastWest: 0 } },
      { title: 'Early Game', scores: { northSouth: 2, eastWest: 1 } },
      { title: 'Mid Game', scores: { northSouth: 4, eastWest: 3 } },
      { title: 'Close Game', scores: { northSouth: 6, eastWest: 6 } },
      { title: 'North-South Wins', scores: { northSouth: 7, eastWest: 5 } },
      { title: 'East-West Wins', scores: { northSouth: 4, eastWest: 7 } },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '800px' }}>
        {scenarios.map((scenario, index) => (
          <div key={index}>
            <h3 style={{ marginBottom: '12px' }}>{scenario.title}</h3>
            <ScoreDisplay scores={scenario.scores} maxScore={7} />
          </div>
        ))}
      </div>
    );
  },
};