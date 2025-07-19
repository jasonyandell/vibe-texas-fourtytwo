import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { DominoHand } from '../DominoHand'
import { GameBoard } from '../GameBoard'
import { Domino, createDomino } from '@/types/texas42'
import { createEmptyGameState } from '@texas42/shared-types'

describe('Visual Validation Tests', () => {
  // Generate all 28 domino combinations for visual testing
  const generateAllDominoes = (): Domino[] => {
    const dominoes: Domino[] = []
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        dominoes.push(createDomino(high, low))
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

    it('displays point values correctly for count dominoes', () => {
      // Test 5-point dominoes: 5-0, 4-1, 3-2
      const fivePointDominoes = [
        createDomino(5, 0),
        createDomino(4, 1),
        createDomino(3, 2)
      ]

      fivePointDominoes.forEach(domino => {
        const { unmount } = render(
          <DominoComponent domino={domino} showPointValue={true} />
        )

        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        const pointValueElement = dominoElement.querySelector('.point-value')

        expect(pointValueElement).toBeInTheDocument()
        expect(pointValueElement).toHaveTextContent('5')
        expect(pointValueElement?.className).toContain('fivePoints')

        unmount()
      })

      // Test 10-point dominoes: 6-4, 5-5
      const tenPointDominoes = [
        createDomino(6, 4),
        createDomino(5, 5)
      ]

      tenPointDominoes.forEach(domino => {
        const { unmount } = render(
          <DominoComponent domino={domino} showPointValue={true} />
        )

        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        const pointValueElement = dominoElement.querySelector('.point-value')

        expect(pointValueElement).toBeInTheDocument()
        expect(pointValueElement).toHaveTextContent('10')
        expect(pointValueElement?.className).toContain('tenPoints')

        unmount()
      })
    })

    it('highlights count dominoes when enabled', () => {
      const countDomino = createDomino(5, 0) // 5-point domino
      const regularDomino = createDomino(6, 1) // 0-point domino

      // Test count domino highlighting
      const { rerender } = render(
        <DominoComponent domino={countDomino} highlightCount={true} />
      )
      let dominoElement = screen.getByTestId(`domino-${countDomino.high}-${countDomino.low}`)
      expect(dominoElement).toHaveClass('count-domino')

      // Test regular domino (should not be highlighted)
      rerender(
        <DominoComponent domino={regularDomino} highlightCount={true} />
      )
      dominoElement = screen.getByTestId(`domino-${regularDomino.high}-${regularDomino.low}`)
      expect(dominoElement).not.toHaveClass('count-domino')
    })

    it('hides point values when face down', () => {
      const countDomino = createDomino(6, 4) // 10-point domino

      const { container } = render(
        <DominoComponent
          domino={countDomino}
          showPointValue={true}
          faceDown={true}
        />
      )

      const pointValueElement = container.querySelector('.point-value')
      expect(pointValueElement).not.toBeInTheDocument()
    })
  })

  describe('Point Value System Validation', () => {
    it('validates all 28 domino combinations have correct point values', () => {
      const expectedPointValues = new Map([
        // 5-point dominoes
        ['5-0', 5], ['4-1', 5], ['3-2', 5],
        // 10-point dominoes
        ['6-4', 10], ['5-5', 10],
        // All other dominoes should have 0 points
      ])

      let totalPoints = 0
      let countDominoes = 0

      allDominoes.forEach(domino => {
        const dominoKey = `${domino.high}-${domino.low}`
        const expectedPoints = expectedPointValues.get(dominoKey) || 0

        expect(domino.pointValue).toBe(expectedPoints)
        expect(domino.isCountDomino).toBe(expectedPoints > 0)

        totalPoints += domino.pointValue
        if (domino.isCountDomino) countDominoes++
      })

      // Validate total point system: 35 count points + 7 tricks = 42 total
      expect(totalPoints).toBe(35)
      expect(countDominoes).toBe(5)
    })

    it('renders all 28 dominoes with proper visual structure and accessibility', () => {
      allDominoes.forEach(domino => {
        const { unmount } = render(
          <DominoComponent
            domino={domino}
            showPointValue={true}
            highlightCount={true}
          />
        )

        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)

        // Check accessibility
        expect(dominoElement).toHaveAttribute('role', 'button')
        expect(dominoElement).toHaveAttribute('aria-label')

        const ariaLabel = dominoElement.getAttribute('aria-label')
        expect(ariaLabel).toContain(`${domino.high === 0 ? 'blank' : domino.high}`)
        expect(ariaLabel).toContain(`${domino.low === 0 ? 'blank' : domino.low}`)

        if (domino.pointValue > 0) {
          expect(ariaLabel).toContain(`${domino.pointValue} points`)
          expect(dominoElement).toHaveClass('count-domino')
        }

        unmount()
      })
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
    const mockGameState = createEmptyGameState('visual-test-game')
    // Add test-specific data
    mockGameState.phase = 'playing'
    mockGameState.players = [
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
    ]
    mockGameState.dealer = 'north-player'
    mockGameState.currentPlayer = 'north-player'
    mockGameState.partnerships.northSouth.currentHandScore = 15
    mockGameState.partnerships.eastWest.currentHandScore = 12
    mockGameState.gameScore = { northSouth: 3, eastWest: 2 }
    mockGameState.trump = 'sixes'

    it('renders complete baseball diamond layout', () => {
      render(
        <GameBoard gameState={mockGameState} />
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
        <GameBoard gameState={mockGameState} />
      )
      
      // Check game phase display
      expect(screen.getByText('Playing Phase')).toBeInTheDocument()
      
      // Check trump suit display
      expect(screen.getByText('Trump: Sixes')).toBeInTheDocument()
      
      // Check scores
      expect(screen.getByText('15')).toBeInTheDocument() // North-South score
      expect(screen.getByText('12')).toBeInTheDocument() // East-West score
      expect(screen.getByText('Games: 3')).toBeInTheDocument() // North-South game score
      expect(screen.getByText('Games: 2')).toBeInTheDocument() // East-West game score
    })

    it('shows player information with proper styling', () => {
      render(
        <GameBoard gameState={mockGameState} currentPlayerId="north-player" />
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
    const responsiveGameState = createEmptyGameState('responsive-test-game')
    // Add test-specific data
    responsiveGameState.phase = 'playing'
    responsiveGameState.players = [
      {
        id: 'test-player',
        name: 'Test Player',
        position: 'north',
        hand: allDominoes.slice(0, 7),
        isConnected: true,
        isReady: true
      }
    ]
    responsiveGameState.dealer = 'test-player'
    responsiveGameState.currentPlayer = 'test-player'

    it('applies responsive classes to all major components', () => {
      const { container } = render(
        <GameBoard gameState={responsiveGameState} />
      )

      const gameBoard = container.querySelector('.game-board')
      expect(gameBoard).toHaveClass('responsive')

      const diamond = container.querySelector('.baseball-diamond')
      expect(diamond).toHaveClass('mobile-friendly')
    })
  })
})
