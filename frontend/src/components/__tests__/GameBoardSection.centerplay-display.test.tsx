import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Center Play Area Display', () => {
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