import type { Meta, StoryObj } from '@storybook/react';
import { DominoComponent } from './DominoComponent';
import { createDomino, createFullDominoSet } from '@/types/domino';

const meta = {
  title: 'Game/DominoComponent',
  component: DominoComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    pointValuePosition: {
      control: { type: 'radio' },
      options: ['corner', 'overlay', 'badge'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DominoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default domino showing the 6-4 count domino
 */
export const Default: Story = {
  args: {
    domino: createDomino(6, 4),
    orientation: 'horizontal',
  },
};

/**
 * Display all 28 dominoes in the standard double-six set
 * Arranged in a grid for visual reference
 */
export const All28Dominoes: Story = {
  args: {
    domino: createDomino(6, 4),
  },
  render: () => {
    const { dominoes } = createFullDominoSet();
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '10px',
        padding: '20px',
      }}>
        {dominoes.map((domino) => (
          <DominoComponent
            key={domino.id}
            domino={domino}
            highlightCount={true}
            showPointValue={true}
            pointValuePosition="corner"
          />
        ))}
      </div>
    );
  },
};

/**
 * Show horizontal and vertical orientations
 */
export const Orientations: Story = {
  args: {
    domino: createDomino(5, 3),
  },
  render: () => {
    const domino = createDomino(5, 3);
    return (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <div>
          <h3>Horizontal</h3>
          <DominoComponent domino={domino} orientation="horizontal" />
        </div>
        <div>
          <h3>Vertical</h3>
          <DominoComponent domino={domino} orientation="vertical" />
        </div>
      </div>
    );
  },
};

/**
 * Interactive states: normal, selected, highlighted, playable
 */
export const InteractiveStates: Story = {
  args: {
    domino: createDomino(4, 2),
  },
  render: () => {
    const domino = createDomino(4, 2);
    return (
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3>Normal</h3>
          <DominoComponent domino={domino} />
        </div>
        <div>
          <h3>Selected</h3>
          <DominoComponent domino={domino} selected={true} />
        </div>
        <div>
          <h3>Playable</h3>
          <DominoComponent domino={domino} isPlayable={true} />
        </div>
        <div>
          <h3>Highlighted Count</h3>
          <DominoComponent domino={domino} highlightCount={true} />
        </div>
        <div>
          <h3>Face Down</h3>
          <DominoComponent domino={domino} faceDown={true} />
        </div>
      </div>
    );
  },
};

/**
 * The five count dominoes in Texas 42:
 * 5-0 (5 points), 4-1 (5 points), 3-2 (5 points), 6-4 (10 points), 5-5 (10 points)
 */
export const CountDominoes: Story = {
  args: {
    domino: createDomino(6, 4),
  },
  render: () => {
    const countDominoes = [
      createDomino(5, 0),  // 5 points
      createDomino(4, 1),  // 5 points
      createDomino(3, 2),  // 5 points
      createDomino(6, 4),  // 10 points
      createDomino(5, 5),  // 10 points
    ];
    
    return (
      <div>
        <h3>Count Dominoes (35 total points)</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          {countDominoes.map((domino) => (
            <div key={domino.id} style={{ textAlign: 'center' }}>
              <DominoComponent
                domino={domino}
                highlightCount={true}
                showPointValue={true}
                pointValuePosition="overlay"
              />
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                {domino.high}-{domino.low} ({domino.pointValue} pts)
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Interactive click demo - shows selection toggle
 */
export const ClickToSelect: Story = {
  args: {
    domino: createDomino(3, 3),
  },
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const domino = createDomino(3, 3);
    
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Click to Select</h3>
        <DominoComponent
          domino={domino}
          isPlayable={true}
          selected={selectedId === domino.id}
          onClick={() => setSelectedId(selectedId === domino.id ? null : domino.id)}
        />
        <p style={{ marginTop: '20px' }}>
          {selectedId ? 'Selected!' : 'Click the domino to select it'}
        </p>
      </div>
    );
  },
};

/**
 * Point value display options
 */
export const PointValuePositions: Story = {
  args: {
    domino: createDomino(6, 4),
  },
  render: () => {
    const domino = createDomino(6, 4); // 10-point domino
    
    return (
      <div style={{ display: 'flex', gap: '30px' }}>
        <div>
          <h3>Corner</h3>
          <DominoComponent
            domino={domino}
            showPointValue={true}
            pointValuePosition="corner"
          />
        </div>
        <div>
          <h3>Overlay</h3>
          <DominoComponent
            domino={domino}
            showPointValue={true}
            pointValuePosition="overlay"
          />
        </div>
        <div>
          <h3>Badge</h3>
          <DominoComponent
            domino={domino}
            showPointValue={true}
            pointValuePosition="badge"
          />
        </div>
      </div>
    );
  },
};

// Import React for stories that use hooks
import React from 'react';