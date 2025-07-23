import type { Meta, StoryObj } from '@storybook/react';
import { TrumpSuitCard } from './TrumpSuitCard';
import { trumpSuits } from '@/utils/trumpUtils';
import { useState } from 'react';
import { DominoSuit } from '@/types/texas42';

const meta = {
  title: 'Game/TrumpSuitCard',
  component: TrumpSuitCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isSelected: {
      control: { type: 'boolean' },
      description: 'Whether this trump suit is currently selected',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrumpSuitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unselected state - Blanks
 */
export const Default: Story = {
  args: {
    trumpInfo: trumpSuits[0], // Blanks
    isSelected: false,
    onClick: () => console.log('Blanks selected'),
  },
};

/**
 * Selected state
 */
export const Selected: Story = {
  args: {
    trumpInfo: trumpSuits[5], // Fives
    isSelected: true,
    onClick: () => console.log('Fives clicked'),
  },
};

/**
 * All trump suits displayed in a grid
 */
export const AllSuits: Story = {
  args: {
    trumpInfo: trumpSuits[0],
    isSelected: false,
    onClick: () => {},
  },
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '10px',
      maxWidth: '600px'
    }}>
      {trumpSuits.map((trumpInfo) => (
        <TrumpSuitCard
          key={trumpInfo.suit}
          trumpInfo={trumpInfo}
          isSelected={false}
          onClick={() => console.log(`${trumpInfo.suit} clicked`)}
        />
      ))}
    </div>
  ),
};

/**
 * Interactive selection - click to select/deselect
 */
export const InteractiveSelection: Story = {
  args: {
    trumpInfo: trumpSuits[0],
    isSelected: false,
    onClick: () => {},
  },
  render: function TrumpSuitSelector(_args) {
    const [selectedSuit, setSelectedSuit] = useState<DominoSuit | null>(null);
    
    return (
      <div>
        <h3 style={{ marginBottom: '20px' }}>Click to select a trump suit</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '10px',
          maxWidth: '600px'
        }}>
          {trumpSuits.map((trumpInfo) => (
            <TrumpSuitCard
              key={trumpInfo.suit}
              trumpInfo={trumpInfo}
              isSelected={selectedSuit === trumpInfo.suit}
              onClick={() => setSelectedSuit(
                selectedSuit === trumpInfo.suit ? null : trumpInfo.suit
              )}
            />
          ))}
        </div>
        {selectedSuit && (
          <p style={{ marginTop: '20px' }}>
            Selected: {trumpSuits.find(t => t.suit === selectedSuit)?.label}
          </p>
        )}
      </div>
    );
  },
};

/**
 * Disabled state (simulated with opacity)
 */
export const Disabled: Story = {
  args: {
    trumpInfo: trumpSuits[3], // Threes
    isSelected: false,
    onClick: () => console.log('Disabled - no action'),
  },
  decorators: [
    (Story) => (
      <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Special doubles suit (if supported)
 */
export const DoublesSuit: Story = {
  args: {
    trumpInfo: {
      suit: 'doubles' as DominoSuit,
      label: 'Doubles',
      description: 'All double dominoes (0-0, 1-1, 2-2, etc.)',
      dominoCount: 7,
    },
    isSelected: false,
    onClick: () => console.log('Doubles selected'),
  },
};

/**
 * Multiple selections allowed
 */
export const MultipleSelections: Story = {
  args: {
    trumpInfo: trumpSuits[0],
    isSelected: false,
    onClick: () => {},
  },
  render: function MultiTrumpSelector(_args) {
    const [selectedSuits, setSelectedSuits] = useState<Set<DominoSuit>>(new Set());
    
    const toggleSuit = (suit: DominoSuit) => {
      const newSelected = new Set(selectedSuits);
      if (newSelected.has(suit)) {
        newSelected.delete(suit);
      } else {
        newSelected.add(suit);
      }
      setSelectedSuits(newSelected);
    };
    
    return (
      <div>
        <h3 style={{ marginBottom: '20px' }}>Multiple selection demo</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '10px',
          maxWidth: '600px'
        }}>
          {trumpSuits.map((trumpInfo) => (
            <TrumpSuitCard
              key={trumpInfo.suit}
              trumpInfo={trumpInfo}
              isSelected={selectedSuits.has(trumpInfo.suit)}
              onClick={() => toggleSuit(trumpInfo.suit)}
            />
          ))}
        </div>
        {selectedSuits.size > 0 && (
          <p style={{ marginTop: '20px' }}>
            Selected: {Array.from(selectedSuits).join(', ')}
          </p>
        )}
      </div>
    );
  },
};

/**
 * Custom styling example
 */
export const CustomStyling: Story = {
  args: {
    trumpInfo: trumpSuits[6], // Sixes
    isSelected: true,
    onClick: () => console.log('Sixes clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '20px',
        background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)',
        borderRadius: '8px'
      }}>
        <Story />
      </div>
    ),
  ],
};