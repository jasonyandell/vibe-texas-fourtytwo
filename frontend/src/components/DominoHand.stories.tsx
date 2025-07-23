import type { Meta, StoryObj } from '@storybook/react';
import { DominoHand } from './DominoHand';
import { createDomino, createFullDominoSet } from '@/types/domino';
import { Domino } from '@/types/texas42';
import React from 'react';

const meta = {
  title: 'Game/DominoHand',
  component: DominoHand,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    compact: {
      control: 'boolean',
    },
    faceDown: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '40px', minWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DominoHand>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a random hand of 7 dominoes
function createRandomHand(): Domino[] {
  const { dominoes } = createFullDominoSet();
  const shuffled = [...dominoes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}

/**
 * Default hand with 7 random dominoes
 */
export const Default: Story = {
  args: {
    dominoes: createRandomHand(),
    orientation: 'horizontal',
  },
};

/**
 * Empty hand showing gap placeholders
 */
export const EmptyHand: Story = {
  args: {
    dominoes: [null, null, null, null, null, null, null],
  },
};

/**
 * Hand with some selected dominoes
 */
export const WithSelection: Story = {
  args: {
    dominoes: createRandomHand(),
  },
  render: () => {
    const hand = createRandomHand();
    const [selectedDomino, setSelectedDomino] = React.useState<Domino | undefined>(hand[2]);
    
    return (
      <DominoHand
        dominoes={hand}
        selectedDomino={selectedDomino}
        onDominoClick={(domino) => setSelectedDomino(domino)}
        playableDominoes={hand} // All playable for demo
      />
    );
  },
};

/**
 * Hand containing all 5 count dominoes
 * Shows 5-0, 4-1, 3-2, 6-4, 5-5 plus 2 non-count dominoes
 */
export const AllCountDominoes: Story = {
  args: {
    dominoes: [
      createDomino(5, 0),  // 5 points
      createDomino(4, 1),  // 5 points
      createDomino(3, 2),  // 5 points
      createDomino(6, 4),  // 10 points
      createDomino(5, 5),  // 10 points
      createDomino(6, 6),  // 0 points
      createDomino(2, 1),  // 0 points
    ],
  },
};

/**
 * Interactive demo - click dominoes to select them
 */
export const InteractionDemo: Story = {
  args: {
    dominoes: createRandomHand(),
  },
  render: () => {
    const hand = createRandomHand();
    const [selectedDomino, setSelectedDomino] = React.useState<Domino | undefined>();
    const [playedDominoes, setPlayedDominoes] = React.useState<string[]>([]);
    
    const remainingDominoes = hand.map(d => 
      playedDominoes.includes(d.id) ? null : d
    );
    
    const handleDominoClick = (domino: Domino) => {
      if (selectedDomino?.id === domino.id) {
        // Double-click to play
        setPlayedDominoes([...playedDominoes, domino.id]);
        setSelectedDomino(undefined);
      } else {
        setSelectedDomino(domino);
      }
    };
    
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Click to select, double-click to play</h3>
        <DominoHand
          dominoes={remainingDominoes}
          selectedDomino={selectedDomino}
          onDominoClick={handleDominoClick}
          playableDominoes={hand.filter(d => !playedDominoes.includes(d.id))}
        />
        <p style={{ marginTop: '20px' }}>
          {selectedDomino 
            ? `Selected: ${selectedDomino.high}-${selectedDomino.low}` 
            : 'Click a domino to select'}
        </p>
        {playedDominoes.length > 0 && (
          <p>Played: {playedDominoes.length} dominoes</p>
        )}
      </div>
    );
  },
};

/**
 * Different display modes
 */
export const DisplayModes: Story = {
  args: {
    dominoes: createRandomHand(),
  },
  render: () => {
    const hand = createRandomHand();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h3>Normal</h3>
          <DominoHand dominoes={hand} />
        </div>
        <div>
          <h3>Compact</h3>
          <DominoHand dominoes={hand} compact={true} />
        </div>
        <div>
          <h3>Face Down</h3>
          <DominoHand dominoes={hand} faceDown={true} />
        </div>
      </div>
    );
  },
};

/**
 * Partially filled hand showing gaps
 */
export const PartialHand: Story = {
  args: {
    dominoes: [
      createDomino(6, 6),
      null,
      createDomino(5, 4),
      createDomino(3, 3),
      null,
      createDomino(2, 0),
      null,
    ],
  },
};

/**
 * With playable dominoes highlighted
 */
export const PlayableDominoes: Story = {
  args: {
    dominoes: createRandomHand(),
  },
  render: () => {
    const hand = createRandomHand();
    const playableDominoes = [hand[1], hand[3], hand[5]]; // Mark some as playable
    
    return (
      <div>
        <h3>Green highlight shows playable dominoes</h3>
        <DominoHand
          dominoes={hand}
          playableDominoes={playableDominoes}
          onDominoClick={(domino) => {
            if (playableDominoes.includes(domino)) {
              alert(`You can play ${domino.high}-${domino.low}`);
            } else {
              alert(`${domino.high}-${domino.low} is not playable`);
            }
          }}
        />
      </div>
    );
  },
};

/**
 * Vertical orientation display
 */
export const VerticalOrientation: Story = {
  args: {
    dominoes: createRandomHand(),
    orientation: 'vertical',
  },
};