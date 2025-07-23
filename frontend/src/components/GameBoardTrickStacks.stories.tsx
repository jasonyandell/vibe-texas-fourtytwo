import type { Meta, StoryObj } from '@storybook/react';
import { GameBoardTrickStacks } from './GameBoardTrickStacks';
import { GameState, Trick, PlayedDomino, PlayerPosition } from '@texas42/shared-types';
import { createEmptyGameState } from '@texas42/shared-types';
import { mockPlayers } from '../stories/fixtures/players';
import { countDominoes, exampleHands } from '../stories/fixtures/dominoes';

const meta = {
  title: 'Game/GameBoardTrickStacks',
  component: GameBoardTrickStacks,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameBoardTrickStacks>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create a trick
function createTrick(
  id: string,
  winner: PlayerPosition,
  dominoes: PlayedDomino[],
  pointValue: number,
  trickNumber: number
): Trick {
  const winnerPlayer = mockPlayers.find(p => p.position === winner);
  return {
    id,
    dominoes,
    winner: winnerPlayer?.id,
    leadSuit: (['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'] as const)[dominoes[0]?.domino.high || 0],
    pointValue,
    countDominoes: dominoes
      .map(d => d.domino)
      .filter(domino => 
        (domino.high === 5 && domino.low === 0) ||
        (domino.high === 4 && domino.low === 1) ||
        (domino.high === 3 && domino.low === 2) ||
        (domino.high === 6 && domino.low === 4) ||
        (domino.high === 5 && domino.low === 5)
      ),
    trickNumber,
    isComplete: true,
  };
}

// Base game state
const baseGameState: GameState = {
  ...createEmptyGameState('story-game'),
  players: mockPlayers,
  phase: 'playing',
};

export const Empty: Story = {
  args: {
    gameState: {
      ...baseGameState,
      tricks: [],
    },
  },
};

export const PartialStacks: Story = {
  args: {
    gameState: {
      ...baseGameState,
      tricks: [
        // North-South won 2 tricks
        createTrick(
          'trick-1',
          'north',
          [
            { domino: exampleHands.strongHand[0], playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: exampleHands.balancedHand[1], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: exampleHands.weakHand[2], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[3], playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          0,
          1
        ),
        createTrick(
          'trick-2',
          'south',
          [
            { domino: countDominoes.fourOne, playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: exampleHands.balancedHand[4], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[2], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: exampleHands.weakHand[1], playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          5,
          2
        ),
        // East-West won 1 trick
        createTrick(
          'trick-3',
          'west',
          [
            { domino: exampleHands.balancedHand[0], playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: exampleHands.weakHand[3], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[4], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: countDominoes.sixFour, playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          5,
          3
        ),
      ],
    },
  },
};

export const FullStacks: Story = {
  args: {
    gameState: {
      ...baseGameState,
      tricks: [
        // Generate 7 tricks (full hand)
        ...Array.from({ length: 7 }, (_, i) => {
          const winner: PlayerPosition = i % 2 === 0 ? (i < 4 ? 'north' : 'south') : (i < 4 ? 'east' : 'west');
          return createTrick(
            `trick-${i + 1}`,
            winner,
            [
              { domino: exampleHands.strongHand[i % exampleHands.strongHand.length], playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
              { domino: exampleHands.balancedHand[i % exampleHands.balancedHand.length], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
              { domino: exampleHands.weakHand[i % exampleHands.weakHand.length], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
              { domino: exampleHands.strongHand[(i + 3) % exampleHands.strongHand.length], playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
            ],
            i === 0 || i === 3 ? 5 : 0, // Some tricks worth points
            i + 1
          );
        }),
      ],
    },
  },
};

export const WithCountDominoes: Story = {
  args: {
    gameState: {
      ...baseGameState,
      tricks: [
        // North-South captures count dominoes
        createTrick(
          'trick-1',
          'north',
          [
            { domino: countDominoes.fiveBlank, playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: exampleHands.balancedHand[1], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: countDominoes.fourOne, playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[3], playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          10, // Two count dominoes
          1
        ),
        createTrick(
          'trick-2',
          'south',
          [
            { domino: countDominoes.treyDeuce, playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: exampleHands.weakHand[0], playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[2], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: exampleHands.weakHand[1], playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          5, // One count domino
          2
        ),
        // East-West captures count dominoes
        createTrick(
          'trick-3',
          'east',
          [
            { domino: exampleHands.balancedHand[0], playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
            { domino: countDominoes.sixFour, playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
            { domino: exampleHands.strongHand[4], playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() },
            { domino: countDominoes.doubleFive, playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
          ],
          10, // Two count dominoes
          3
        ),
      ],
    },
  },
};