import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Interaction', () => {
  const mockDominoes: Domino[] = [
    createDomino(6, 6),
    createDomino(5, 4),
    createDomino(3, 2),
    createDomino(1, 0),
    createDomino(4, 4),
    createDomino(2, 1),
    createDomino(6, 3)
  ]

  describe('Interactive Features', () => {
    it('calls onDominoClick when a domino is clicked', () => {
      const mockOnClick = vi.fn()
      render(<DominoHand dominoes={mockDominoes} onDominoClick={mockOnClick} />)
      
      const firstDomino = screen.getByTestId('domino-6-6')
      fireEvent.click(firstDomino)
      
      expect(mockOnClick).toHaveBeenCalledWith(mockDominoes[0])
    })

    it('marks playable dominoes correctly', () => {
      const playableDominoes = [mockDominoes[0], mockDominoes[2]]
      render(
        <DominoHand 
          dominoes={mockDominoes} 
          playableDominoes={playableDominoes}
        />
      )
      
      expect(screen.getByTestId('domino-6-6')).toHaveClass('playable')
      expect(screen.getByTestId('domino-3-2')).toHaveClass('playable')
      expect(screen.getByTestId('domino-5-4')).not.toHaveClass('playable')
    })

    it('marks selected domino correctly', () => {
      render(
        <DominoHand 
          dominoes={mockDominoes} 
          selectedDomino={mockDominoes[1]}
        />
      )
      
      expect(screen.getByTestId('domino-5-4')).toHaveClass('selected')
      expect(screen.getByTestId('domino-6-6')).not.toHaveClass('selected')
    })
  })
})