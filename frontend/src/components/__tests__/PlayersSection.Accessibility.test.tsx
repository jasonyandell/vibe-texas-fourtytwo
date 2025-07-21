import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<PlayersSection />)
    
    expect(screen.getByLabelText('Baseball diamond player layout')).toBeInTheDocument()
    expect(screen.getByLabelText('Player interaction controls')).toBeInTheDocument()
  })

  it('supports keyboard navigation for player cards', () => {
    render(<PlayersSection />)
    
    const northCard = screen.getByTestId('player-card-north')
    expect(northCard).toHaveAttribute('tabIndex', '0')
    expect(northCard).toHaveAttribute('role', 'button')
  })

  it('announces partnership changes to screen readers', () => {
    render(<PlayersSection />)
    
    const announcer = screen.getByTestId('partnership-announcer')
    expect(announcer).toHaveAttribute('aria-live', 'polite')
    expect(announcer).toHaveAttribute('aria-atomic', 'true')
  })
})