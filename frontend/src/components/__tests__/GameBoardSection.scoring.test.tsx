import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Score Display', () => {
  describe('Score Display', () => {
    it('renders score display section', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByText('Score & Game Status')).toBeInTheDocument()
      expect(screen.getByText(/Current scores, game phase, and bid information/)).toBeInTheDocument()
    })

    it('displays game status information', () => {
      render(<GameBoardSection />)

      const gameStatus = screen.getByTestId('demo-game-status')
      expect(gameStatus).toBeInTheDocument()
      expect(gameStatus).toHaveTextContent('Phase:')
      expect(gameStatus).toHaveTextContent('Playing Phase')
    })

    it('displays current bid information', () => {
      render(<GameBoardSection />)

      const gameStatus = screen.getByTestId('demo-game-status')
      expect(gameStatus).toHaveTextContent('Current Bid:')
      expect(gameStatus).toHaveTextContent('32 - Sixes (6s)')
      expect(gameStatus).toHaveTextContent('by North')
    })

    it('displays current hand scores', () => {
      render(<GameBoardSection />)

      const scoresDisplay = screen.getByTestId('demo-scores-display')
      expect(scoresDisplay).toBeInTheDocument()
      expect(scoresDisplay).toHaveTextContent('Current Hand Scores')

      // Team names and scores within the scores display
      expect(scoresDisplay).toHaveTextContent('North-South')
      expect(scoresDisplay).toHaveTextContent('East-West')
      expect(scoresDisplay).toHaveTextContent('15') // North-South score
      expect(scoresDisplay).toHaveTextContent('8')  // East-West score
      expect(scoresDisplay).toHaveTextContent('Games: 2') // North-South games
      expect(scoresDisplay).toHaveTextContent('Games: 1') // East-West games
    })
  })
})