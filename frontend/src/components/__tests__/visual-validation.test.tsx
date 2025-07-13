import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DominoComponent } from '../DominoComponent'
import { DominoHand } from '../DominoHand'
import { GameBoard } from '../GameBoard'
import { Domino, GameState } from '@/types/texas42'
import { BrowserRouter } from 'react-router-dom'

describe('Visual Validation Tests', () => {
  // Generate all 28 domino combinations for visual testing
  const generateAllDominoes = (): Domino[] => {
    const dominoes: Domino[] = []
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        dominoes.push({
          id: `domino-${high}-${low}`,
          high,
          low
        })
      }
    }
    return dominoes
  }

  const allDominoes = generateAllDominoes()

  describe('Domino Visual States', () => {
    it('renders all domino combinations with correct visual structure', () => {
      allDominoes.forEach(domino => {
        const { unmount } = render(<DominoComponent domino={domino} />)
        
        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        
        // Check basic structure
        expect(dominoElement).toHaveClass('domino')
        expect(dominoElement.querySelector('.domino-half.domino-high')).toBeInTheDocument()
        expect(dominoElement.querySelector('.domino-half.domino-low')).toBeInTheDocument()
        expect(dominoElement.querySelector('.domino-divider')).toBeInTheDocument()
        
        // Check pip count
        const highHalf = dominoElement.querySelector('.domino-half.domino-high')
        const lowHalf = dominoElement.querySelector('.domino-half.domino-low')
        expect(highHalf?.querySelectorAll('.pip')).toHaveLength(domino.high)
        expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(domino.low)
        
        unmount()
      })
    })

    it('applies correct visual states for interactive dominoes', () => {
      const testDomino = allDominoes[10] // Pick a mid-range domino
      
      // Test playable state
      const { rerender } = render(
        <DominoComponent domino={testDomino} isPlayable={true} />
      )
      let dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
      expect(dominoElement).toHaveClass('playable')
      
      // Test selected state
      rerender(
        <DominoComponent domino={testDomino} isPlayable={true} selected={true} />
      )
      dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
      expect(dominoElement).toHaveClass('selected')
      
      // Test face-down state
      rerender(
        <DominoComponent domino={testDomino} faceDown={true} />
      )
      dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
      expect(dominoElement).toHaveClass('face-down')
    })

    it('renders both orientations correctly', () => {
      const testDomino = allDominoes[15]
      
      // Horizontal orientation
      const { rerender } = render(
        <DominoComponent domino={testDomino} orientation="horizontal" />
      )
      let dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
      expect(dominoElement).toHaveClass('horizontal')
      
      // Vertical orientation
      rerender(
        <DominoComponent domino={testDomino} orientation="vertical" />
      )
      dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
      expect(dominoElement).toHaveClass('vertical')
    })
  })

  describe('DominoHand Visual Layout', () => {
    it('maintains proper 2-row layout structure', () => {
      const fullHand = allDominoes.slice(0, 7)
      const { container } = render(<DominoHand dominoes={fullHand} />)
      
      const handContainer = container.firstChild as HTMLElement
      expect(handContainer).toHaveClass('domino-hand')
      
      const topRow = handContainer.querySelector('.top-row')
      const bottomRow = handContainer.querySelector('.bottom-row')
      
      expect(topRow).toBeInTheDocument()
      expect(bottomRow).toBeInTheDocument()
      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(3)
    })

    it('handles gaps visually correctly', () => {
      const handWithGaps = [
        allDominoes[0],
        null,
        allDominoes[1],
        null,
        allDominoes[2],
        allDominoes[3],
        allDominoes[4]
      ]
      
      const { container } = render(<DominoHand dominoes={handWithGaps} />)
      
      const gaps = container.querySelectorAll('.domino-gap')
      expect(gaps).toHaveLength(2)
      
      gaps.forEach(gap => {
        expect(gap).toHaveClass('domino-gap')
        // Check that gap has visual styling
        expect(gap).toHaveStyle({ opacity: '0.5' })
      })
    })

    it('applies responsive classes correctly', () => {
      const { container } = render(<DominoHand dominoes={allDominoes.slice(0, 5)} />)
      
      const handContainer = container.firstChild as HTMLElement
      expect(handContainer).toHaveClass('responsive')
    })
  })

  describe('GameBoard Visual Structure', () => {
    const mockGameState: GameState = {
      id: 'visual-test-game',
      phase: 'playing',
      players: [
        {
          id: 'north-player',
          name: 'North Player',
          position: 'north',
          hand: allDominoes.slice(0, 7),
          isConnected: true,
          isReady: true
        },
        {
          id: 'east-player',
          name: 'East Player',
          position: 'east',
          hand: allDominoes.slice(7, 14),
          isConnected: true,
          isReady: true
        },
        {
          id: 'south-player',
          name: 'South Player',
          position: 'south',
          hand: allDominoes.slice(14, 21),
          isConnected: true,
          isReady: true
        },
        {
          id: 'west-player',
          name: 'West Player',
          position: 'west',
          hand: allDominoes.slice(21, 28),
          isConnected: true,
          isReady: true
        }
      ],
      dealer: 'north-player',
      currentPlayer: 'north-player',
      scores: { northSouth: 15, eastWest: 12 },
      gameScore: { northSouth: 3, eastWest: 2 },
      tricks: [],
      boneyard: [],
      trump: 'sixes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    it('renders complete baseball diamond layout', () => {
      render(
        <BrowserRouter>
          <GameBoard gameState={mockGameState} />
        </BrowserRouter>
      )
      
      // Check main structure
      const gameBoard = screen.getByTestId('game-board')
      expect(gameBoard).toHaveClass('game-board')
      expect(gameBoard).toHaveClass('responsive')
      
      // Check baseball diamond
      const diamond = screen.getByTestId('baseball-diamond')
      expect(diamond).toHaveClass('baseball-diamond')
      expect(diamond).toHaveClass('mobile-friendly')
      
      // Check all player positions
      expect(screen.getByTestId('player-area-north')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-east')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-south')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-west')).toBeInTheDocument()
      
      // Check center area
      expect(screen.getByTestId('center-play-area')).toBeInTheDocument()
    })

    it('displays game information correctly', () => {
      render(
        <BrowserRouter>
          <GameBoard gameState={mockGameState} />
        </BrowserRouter>
      )
      
      // Check game phase display
      expect(screen.getByText('Playing Phase')).toBeInTheDocument()
      
      // Check trump suit display
      expect(screen.getByText('Trump: Sixes')).toBeInTheDocument()
      
      // Check scores
      expect(screen.getByText('15')).toBeInTheDocument() // North-South score
      expect(screen.getByText('12')).toBeInTheDocument() // East-West score
      expect(screen.getByText('(3)')).toBeInTheDocument() // North-South game score
      expect(screen.getByText('(2)')).toBeInTheDocument() // East-West game score
    })

    it('shows player information with proper styling', () => {
      render(
        <BrowserRouter>
          <GameBoard gameState={mockGameState} currentPlayerId="north-player" />
        </BrowserRouter>
      )
      
      // Check player names
      expect(screen.getByText('North Player')).toBeInTheDocument()
      expect(screen.getByText('East Player')).toBeInTheDocument()
      expect(screen.getByText('South Player')).toBeInTheDocument()
      expect(screen.getByText('West Player')).toBeInTheDocument()
      
      // Check dealer badge
      expect(screen.getByText('Dealer')).toBeInTheDocument()
      
      // Check current player indicator
      expect(screen.getByText('Current Turn')).toBeInTheDocument()
    })
  })

  describe('Responsive Design Validation', () => {
    const responsiveGameState: GameState = {
      id: 'responsive-test-game',
      phase: 'playing',
      players: [
        {
          id: 'test-player',
          name: 'Test Player',
          position: 'north',
          hand: allDominoes.slice(0, 7),
          isConnected: true,
          isReady: true
        }
      ],
      dealer: 'test-player',
      currentPlayer: 'test-player',
      scores: { northSouth: 0, eastWest: 0 },
      gameScore: { northSouth: 0, eastWest: 0 },
      tricks: [],
      boneyard: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    it('applies responsive classes to all major components', () => {
      const { container } = render(
        <BrowserRouter>
          <GameBoard gameState={responsiveGameState} />
        </BrowserRouter>
      )

      const gameBoard = container.querySelector('.game-board')
      expect(gameBoard).toHaveClass('responsive')

      const diamond = container.querySelector('.baseball-diamond')
      expect(diamond).toHaveClass('mobile-friendly')
    })
  })
})
