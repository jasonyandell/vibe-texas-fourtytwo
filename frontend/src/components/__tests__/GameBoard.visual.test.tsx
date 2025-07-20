import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import { createDomino } from '@/types/texas42'
import { createEmptyGameState } from '@texas42/shared-types'

describe('GameBoard Visual Structure', () => {
  // Generate test dominoes
  const generateAllDominoes = () => {
    const dominoes = []
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        dominoes.push(createDomino(high, low))
      }
    }
    return dominoes
  }

  const allDominoes = generateAllDominoes()

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

  it('applies responsive classes to all major components', () => {
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

    const { container } = render(
      <GameBoard gameState={responsiveGameState} />
    )

    const gameBoard = container.querySelector('.game-board')
    expect(gameBoard).toHaveClass('responsive')

    const diamond = container.querySelector('.baseball-diamond')
    expect(diamond).toHaveClass('mobile-friendly')
  })
})