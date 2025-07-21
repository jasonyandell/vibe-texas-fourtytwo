import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpectatorView } from '../SpectatorView';
import { mockGameStateWithPlayerHands, mockSpectators } from './SpectatorView.playerhand.fixtures';

// Mock the child components
vi.mock('@/components/DominoHand', () => ({
  DominoHand: ({ dominoes, faceDown, playable }: { dominoes: { length: number }; faceDown?: boolean; playable?: boolean }) => (
    <div data-testid="domino-hand" data-face-up={!faceDown} data-playable={playable}>
      {dominoes.length} dominoes
    </div>
  )
}));

vi.mock('@/components/GameBoard', () => ({
  GameBoard: ({ gameState, isSpectatorMode }: { gameState: { id: string }; isSpectatorMode?: boolean }) => (
    <div data-testid="game-board" data-spectator-mode={isSpectatorMode}>
      Game Board for {gameState.id}
    </div>
  )
}));

describe('SpectatorView - Player Hand Display', () => {
  it('shows all hands face-up by default', () => {
    render(<SpectatorView gameState={mockGameStateWithPlayerHands} spectators={mockSpectators} />);
    
    const dominoHands = screen.getAllByTestId('domino-hand');
    expect(dominoHands.length).toBeGreaterThan(0);
    dominoHands.forEach(hand => {
      expect(hand).toHaveAttribute('data-face-up', 'true');
      // data-playable attribute is optional - check if it exists before asserting
      if (hand.hasAttribute('data-playable')) {
        expect(hand).toHaveAttribute('data-playable', 'false');
      }
    });
  });

  it('allows toggling show all hands', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameStateWithPlayerHands} spectators={mockSpectators} />);
    
    const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
    expect(showAllHandsCheckbox).toBeChecked();
    
    await user.click(showAllHandsCheckbox);
    expect(showAllHandsCheckbox).not.toBeChecked();
  });

  it('hides hands when show all hands is disabled', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameStateWithPlayerHands} spectators={mockSpectators} />);
    
    const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
    await user.click(showAllHandsCheckbox);
    
    expect(screen.queryByText('Player Hands')).not.toBeInTheDocument();
  });

  it('allows selecting individual players to focus on', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameStateWithPlayerHands} spectators={mockSpectators} />);
    
    const playerSelect = screen.getByLabelText('Focus on Player:');
    await user.selectOptions(playerSelect, 'player-1');
    
    expect(screen.getByText('Focused Player')).toBeInTheDocument();
  });

  it('shows focused player section when player is selected', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameStateWithPlayerHands} spectators={mockSpectators} />);
    
    const playerSelect = screen.getByLabelText('Focus on Player:');
    await user.selectOptions(playerSelect, 'player-2');
    
    expect(screen.getByText('Focused Player')).toBeInTheDocument();
  });
});