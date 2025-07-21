import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection - Responsive Design', () => {
  it('applies responsive classes', () => {
    render(<PlayersSection />)

    const section = screen.getByTestId('players-section-container')
    expect(section.className).toContain('responsive')
  })

  it('maintains diamond layout structure', () => {
    render(<PlayersSection />)

    const diamond = screen.getByTestId('players-diamond')
    expect(diamond.className).toContain('baseballDiamond')
    expect(diamond.className).toContain('mobileFriendly')
  })
})