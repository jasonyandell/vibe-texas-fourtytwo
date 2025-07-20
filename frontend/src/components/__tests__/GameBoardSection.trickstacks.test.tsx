import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Trick Stacks', () => {
  describe('Trick Stacks', () => {
    it('renders trick stacks section', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByText('Trick Stacks')).toBeInTheDocument()
      expect(screen.getByText(/Visual stacks of captured tricks for each partnership/)).toBeInTheDocument()
    })

    it('displays both partnership stacks', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByTestId('demo-trick-stack-north-south')).toBeInTheDocument()
      expect(screen.getByTestId('demo-trick-stack-east-west')).toBeInTheDocument()
      
      expect(screen.getByText('North-South Partnership')).toBeInTheDocument()
      expect(screen.getByText('East-West Partnership')).toBeInTheDocument()
    })

    it('shows trick counts and points for each partnership', () => {
      render(<GameBoardSection />)

      // Check North-South partnership
      const northSouthStack = screen.getByTestId('demo-trick-stack-north-south')
      expect(northSouthStack).toHaveTextContent('Tricks: 3')
      expect(northSouthStack).toHaveTextContent('Points: 15')

      // Check East-West partnership
      const eastWestStack = screen.getByTestId('demo-trick-stack-east-west')
      expect(eastWestStack).toHaveTextContent('Tricks: 2')
      expect(eastWestStack).toHaveTextContent('Points: 8')
    })

    it('displays visual trick stack items', () => {
      render(<GameBoardSection />)
      
      // Should have 3 trick stack items for North-South
      expect(screen.getByTestId('trick-stack-item-ns-0')).toBeInTheDocument()
      expect(screen.getByTestId('trick-stack-item-ns-1')).toBeInTheDocument()
      expect(screen.getByTestId('trick-stack-item-ns-2')).toBeInTheDocument()
      
      // Should have 2 trick stack items for East-West
      expect(screen.getByTestId('trick-stack-item-ew-0')).toBeInTheDocument()
      expect(screen.getByTestId('trick-stack-item-ew-1')).toBeInTheDocument()
    })

    it('updates trick stacks when game state changes', () => {
      render(<GameBoardSection />)

      // Initially 3 tricks for North-South, 2 for East-West
      const northSouthStack = screen.getByTestId('demo-trick-stack-north-south')
      const eastWestStack = screen.getByTestId('demo-trick-stack-east-west')

      expect(northSouthStack).toHaveTextContent('Tricks: 3')
      expect(eastWestStack).toHaveTextContent('Tricks: 2')

      // Switch to scoring phase (4 tricks vs 3 tricks)
      fireEvent.click(screen.getByTestId('game-state-button-1'))

      expect(northSouthStack).toHaveTextContent('Tricks: 4')
      expect(eastWestStack).toHaveTextContent('Tricks: 3')
    })
  })
})