import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Hand Visibility Controls', () => {
  it('renders hand visibility toggle controls', () => {
    render(<PlayersSection />)
    
    expect(screen.getByTestId('toggle-hand-visibility')).toBeInTheDocument()
    expect(screen.getByText('Show Player Hands')).toBeInTheDocument()
  })

  it('shows domino hands when visibility is enabled', () => {
    render(<PlayersSection />)
    
    const toggle = screen.getByTestId('toggle-hand-visibility')
    fireEvent.click(toggle)
    
    // Should show domino hands for all players
    expect(screen.getAllByTestId(/^domino-hand-/)).toHaveLength(4)
  })

  it('hides domino hands when visibility is disabled', () => {
    render(<PlayersSection />)
    
    // Hands should be hidden by default
    expect(screen.queryByTestId(/^domino-hand-/)).not.toBeInTheDocument()
  })

  it('toggles between face-up and face-down hands', () => {
    render(<PlayersSection />)

    const visibilityToggle = screen.getByTestId('toggle-hand-visibility')
    const faceDownToggle = screen.getByTestId('toggle-face-down')

    // Enable hand visibility
    fireEvent.click(visibilityToggle)

    // Toggle face-down mode
    fireEvent.click(faceDownToggle)

    // Check that hands are shown face-down (check the container class)
    const dominoHands = screen.getAllByTestId(/^domino-hand-/)
    dominoHands.forEach(hand => {
      expect(hand.className).toContain('faceDown')
    })
  })
})