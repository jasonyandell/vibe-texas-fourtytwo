import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Center Play Area', () => {
  describe('Center Play Area', () => {
    it('renders center play area section', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByText('Center Play Area')).toBeInTheDocument()
      expect(screen.getByText(/The "pitcher's mound" where the current trick is displayed/)).toBeInTheDocument()
      expect(screen.getByTestId('demo-center-play-area')).toBeInTheDocument()
    })

    it('displays current trick information', () => {
      render(<GameBoardSection />)
      
      // Should show the first trick by default (Opening Trick)
      expect(screen.getByText('Opening Trick')).toBeInTheDocument()
      expect(screen.getByText('First trick of the hand with mixed suits')).toBeInTheDocument()
      expect(screen.getByText(/Winner:.*North/)).toBeInTheDocument()
    })

    it('displays trick dominoes with player labels', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByTestId('current-trick-dominoes')).toBeInTheDocument()
      
      // Check for player position dominoes
      expect(screen.getByTestId('played-domino-north')).toBeInTheDocument()
      expect(screen.getByTestId('played-domino-east')).toBeInTheDocument()
      expect(screen.getByTestId('played-domino-south')).toBeInTheDocument()
      expect(screen.getByTestId('played-domino-west')).toBeInTheDocument()
      
      // Check for player names in the trick dominoes area
      const trickDominoes = screen.getByTestId('current-trick-dominoes')
      expect(trickDominoes).toHaveTextContent('North')
      expect(trickDominoes).toHaveTextContent('East')
      expect(trickDominoes).toHaveTextContent('South')
      expect(trickDominoes).toHaveTextContent('West')
    })

    it('shows trick counter', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByText('1 of 3')).toBeInTheDocument()
    })
  })

  describe('Trick Cycling', () => {
    it('renders trick navigation buttons', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByTestId('prev-trick-button')).toBeInTheDocument()
      expect(screen.getByTestId('next-trick-button')).toBeInTheDocument()
      
      expect(screen.getByLabelText('Show previous trick example')).toBeInTheDocument()
      expect(screen.getByLabelText('Show next trick example')).toBeInTheDocument()
    })

    it('cycles to next trick when next button is clicked', () => {
      render(<GameBoardSection />)
      
      // Initially shows Opening Trick
      expect(screen.getByText('Opening Trick')).toBeInTheDocument()
      
      // Click next button
      fireEvent.click(screen.getByTestId('next-trick-button'))
      
      // Should now show Trump Trick
      expect(screen.getByText('Trump Trick')).toBeInTheDocument()
      expect(screen.getByText('Trick won with trump dominoes (sixes)')).toBeInTheDocument()
      expect(screen.getByText(/Winner:.*South/)).toBeInTheDocument()
      
      // Counter should update
      expect(screen.getByText('2 of 3')).toBeInTheDocument()
    })

    it('cycles to previous trick when previous button is clicked', () => {
      render(<GameBoardSection />)
      
      // Click next to go to second trick
      fireEvent.click(screen.getByTestId('next-trick-button'))
      expect(screen.getByText('Trump Trick')).toBeInTheDocument()
      
      // Click previous to go back to first trick
      fireEvent.click(screen.getByTestId('prev-trick-button'))
      expect(screen.getByText('Opening Trick')).toBeInTheDocument()
      expect(screen.getByText('1 of 3')).toBeInTheDocument()
    })

    it('wraps around when cycling past the last trick', () => {
      render(<GameBoardSection />)
      
      // Click next twice to get to the last trick
      fireEvent.click(screen.getByTestId('next-trick-button'))
      fireEvent.click(screen.getByTestId('next-trick-button'))
      expect(screen.getByText('Count Domino Trick')).toBeInTheDocument()
      expect(screen.getByText('3 of 3')).toBeInTheDocument()
      
      // Click next again to wrap to first trick
      fireEvent.click(screen.getByTestId('next-trick-button'))
      expect(screen.getByText('Opening Trick')).toBeInTheDocument()
      expect(screen.getByText('1 of 3')).toBeInTheDocument()
    })

    it('wraps around when cycling before the first trick', () => {
      render(<GameBoardSection />)
      
      // Initially on first trick, click previous to wrap to last
      fireEvent.click(screen.getByTestId('prev-trick-button'))
      expect(screen.getByText('Count Domino Trick')).toBeInTheDocument()
      expect(screen.getByText('3 of 3')).toBeInTheDocument()
    })
  })
})