import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Player Information', () => {
  it('displays player names and positions', () => {
    render(<PlayersSection />)
    
    // Check that sample players are displayed
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getByText('Diana')).toBeInTheDocument()
    
    // Check position labels
    expect(screen.getByText('North')).toBeInTheDocument()
    expect(screen.getByText('East')).toBeInTheDocument()
    expect(screen.getByText('South')).toBeInTheDocument()
    expect(screen.getByText('West')).toBeInTheDocument()
  })

  it('displays dealer badge for the dealer', () => {
    render(<PlayersSection />)
    
    const dealerBadges = screen.getAllByText('Dealer')
    expect(dealerBadges).toHaveLength(1)
  })

  it('displays ready status indicators', () => {
    render(<PlayersSection />)
    
    const readyIndicators = screen.getAllByText('Ready')
    expect(readyIndicators.length).toBeGreaterThan(0)
  })

  it('displays current turn indicator', () => {
    render(<PlayersSection />)
    
    const currentTurnIndicators = screen.getAllByText('Current Turn')
    expect(currentTurnIndicators).toHaveLength(1)
  })
})