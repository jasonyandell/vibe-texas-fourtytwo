import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Basic Rendering', () => {
  describe('Basic Rendering', () => {
    it('renders the section title and description', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByText('Game Board & Trick Play')).toBeInTheDocument()
      expect(screen.getByText(/Explore the center play area, trick stacks, and scoring displays/)).toBeInTheDocument()
    })

    it('renders the main container with correct test id', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByTestId('game-board-section-container')).toBeInTheDocument()
    })

    it('has proper accessibility attributes', () => {
      render(<GameBoardSection />)
      
      const container = screen.getByTestId('game-board-section-container')
      expect(container).toHaveAttribute('aria-label', 'Game board elements showcase')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive CSS classes', () => {
      render(<GameBoardSection />)

      const container = screen.getByTestId('game-board-section-container')
      // Check that the container has a class containing 'gameBoardSection'
      expect(container.className).toMatch(/gameBoardSection/)
    })
  })
})