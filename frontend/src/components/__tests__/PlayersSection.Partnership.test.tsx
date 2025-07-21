import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Partnership System', () => {
  it('applies correct partnership data attributes', () => {
    render(<PlayersSection />)
    
    const northCard = screen.getByTestId('player-card-north')
    const southCard = screen.getByTestId('player-card-south')
    const eastCard = screen.getByTestId('player-card-east')
    const westCard = screen.getByTestId('player-card-west')
    
    expect(northCard).toHaveAttribute('data-partnership', 'north-south')
    expect(southCard).toHaveAttribute('data-partnership', 'north-south')
    expect(eastCard).toHaveAttribute('data-partnership', 'east-west')
    expect(westCard).toHaveAttribute('data-partnership', 'east-west')
  })

  it('highlights partnership when player is clicked', () => {
    render(<PlayersSection />)

    const northCard = screen.getByTestId('player-card-north')
    fireEvent.click(northCard)

    // North-South partnership should be highlighted
    expect(northCard.className).toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-south').className).toContain('partnershipHighlighted')

    // East-West partnership should not be highlighted
    expect(screen.getByTestId('player-card-east').className).not.toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-west').className).not.toContain('partnershipHighlighted')
  })

  it('toggles partnership highlighting on repeated clicks', () => {
    render(<PlayersSection />)

    const eastCard = screen.getByTestId('player-card-east')

    // First click - highlight
    fireEvent.click(eastCard)
    expect(eastCard.className).toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-west').className).toContain('partnershipHighlighted')

    // Second click - remove highlight
    fireEvent.click(eastCard)
    expect(eastCard.className).not.toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-west').className).not.toContain('partnershipHighlighted')
  })

  it('switches partnership highlighting when different partnership is clicked', () => {
    render(<PlayersSection />)

    const northCard = screen.getByTestId('player-card-north')
    const eastCard = screen.getByTestId('player-card-east')

    // Click North (North-South partnership)
    fireEvent.click(northCard)
    expect(northCard.className).toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-south').className).toContain('partnershipHighlighted')

    // Click East (East-West partnership)
    fireEvent.click(eastCard)
    expect(eastCard.className).toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-west').className).toContain('partnershipHighlighted')

    // North-South should no longer be highlighted
    expect(northCard.className).not.toContain('partnershipHighlighted')
    expect(screen.getByTestId('player-card-south').className).not.toContain('partnershipHighlighted')
  })
})