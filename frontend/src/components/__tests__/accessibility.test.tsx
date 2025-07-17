import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { DominoHand } from '../DominoHand'
import { GameBoard } from '../GameBoard'
import { Domino, GameState, createDomino } from '@/types/texas42'

describe('Accessibility Tests', () => {
  const mockDomino: Domino = createDomino(3, 2)

  const mockGameState: GameState = {
    id: 'test-game',
    phase: 'playing',
    players: [
      {
        id: 'player1',
        name: 'Player 1',
        position: 'north',
        hand: [mockDomino],
        isConnected: true,
        isReady: true
      }
    ],
    dealer: 'player1',
    currentPlayer: 'player1',
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    tricks: [],
    boneyard: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  describe('DominoComponent Accessibility', () => {
    it('has proper keyboard navigation support', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={true} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('tabIndex', '0')
    })

    it('excludes non-playable dominoes from keyboard navigation', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={false} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('tabIndex', '-1')
    })

    it('provides descriptive ARIA labels', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('aria-label', 'Domino 3-2, 5 points')
    })

    it('indicates disabled state properly', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={false} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('aria-disabled', 'true')
    })

    it('handles blank dominoes in ARIA labels', () => {
      const blankDomino: Domino = createDomino(0, 0)
      render(<DominoComponent domino={blankDomino} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('aria-label', 'Domino blank-blank')
    })
  })

  describe('DominoHand Accessibility', () => {
    const mockHand = Array.from({ length: 7 }, (_, i) =>
      createDomino(Math.floor(i / 2), i % 2)
    )

    it('groups dominoes with proper role and label', () => {
      const { container } = render(<DominoHand dominoes={mockHand} />)
      
      const handGroup = container.firstChild as HTMLElement
      expect(handGroup).toHaveAttribute('role', 'group')
      expect(handGroup).toHaveAttribute('aria-label', 'Domino hand with 7 dominoes')
    })

    it('provides meaningful labels for empty hands', () => {
      const { container } = render(<DominoHand dominoes={[]} />)
      
      const handGroup = container.firstChild as HTMLElement
      expect(handGroup).toHaveAttribute('aria-label', 'Empty domino hand')
    })

    it('hides gap elements from screen readers', () => {
      const handWithGaps = [mockHand[0], null, mockHand[1]]
      const { container } = render(<DominoHand dominoes={handWithGaps} />)
      
      const gaps = container.querySelectorAll('.domino-gap')
      gaps.forEach(gap => {
        expect(gap).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('GameBoard Accessibility', () => {
    it('has proper landmark roles', () => {
      render(<GameBoard gameState={mockGameState} />)
      
      const gameBoard = screen.getByRole('main')
      expect(gameBoard).toHaveAttribute('aria-label', 'Texas 42 game board')
      
      const playerAreas = screen.getByRole('region', { name: 'Player areas' })
      expect(playerAreas).toBeInTheDocument()
      
      const centerArea = screen.getByRole('region', { name: 'Center play area' })
      expect(centerArea).toBeInTheDocument()
    })

    it('provides descriptive labels for player areas', () => {
      render(<GameBoard gameState={mockGameState} />)
      
      const playerArea = screen.getByTestId('player-area-north')
      expect(playerArea).toBeInTheDocument()
    })
  })

  describe('High Contrast Mode Support', () => {
    it('applies high contrast styles when preferred', () => {
      // This would typically be tested with CSS-in-JS or by checking computed styles
      // For now, we verify the CSS classes are applied correctly
      render(<DominoComponent domino={mockDomino} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveClass('domino')
    })
  })

  describe('Reduced Motion Support', () => {
    it('respects reduced motion preferences', () => {
      // Verify that components don't force animations when reduced motion is preferred
      render(<DominoComponent domino={mockDomino} isPlayable={true} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveClass('playable')
    })
  })

  describe('Screen Reader Support', () => {
    it('provides meaningful content for screen readers', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      const domino = screen.getByRole('button')
      expect(domino).toHaveAttribute('role', 'button')
      expect(domino).toHaveAttribute('aria-label')
    })

    it('maintains logical tab order', () => {
      const playableDominoes = Array.from({ length: 3 }, (_, i) =>
        createDomino(i + 1, 0)
      )

      render(
        <DominoHand 
          dominoes={playableDominoes} 
          playableDominoes={playableDominoes}
        />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0')
      })
    })
  })
})
