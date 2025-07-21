import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Interactive Controls', () => {
  it('renders all control toggles', () => {
    render(<PlayersSection />)
    
    expect(screen.getByTestId('toggle-hand-visibility')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-face-down')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-dealer-rotation')).toBeInTheDocument()
  })

  it('rotates dealer when dealer rotation is toggled', () => {
    render(<PlayersSection />)
    
    const initialDealer = screen.getByText('Dealer').closest('[data-testid^="player-card-"]')
    const dealerToggle = screen.getByTestId('toggle-dealer-rotation')
    
    fireEvent.click(dealerToggle)
    
    const newDealer = screen.getByText('Dealer').closest('[data-testid^="player-card-"]')
    expect(newDealer).not.toBe(initialDealer)
  })
})