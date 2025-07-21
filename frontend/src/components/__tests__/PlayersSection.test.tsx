import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayersSection } from '../PlayersSection'

describe('PlayersSection', () => {
  describe('Basic Rendering', () => {
    it('renders the section title and description', () => {
      render(<PlayersSection />)
      
      expect(screen.getByText('Baseball Diamond Layout')).toBeInTheDocument()
      expect(screen.getByText(/4-player positioning with North-South vs East-West partnerships/)).toBeInTheDocument()
    })

    it('renders all 4 player positions in diamond formation', () => {
      render(<PlayersSection />)
      
      expect(screen.getByTestId('player-card-north')).toBeInTheDocument()
      expect(screen.getByTestId('player-card-east')).toBeInTheDocument()
      expect(screen.getByTestId('player-card-south')).toBeInTheDocument()
      expect(screen.getByTestId('player-card-west')).toBeInTheDocument()
    })

    it('displays the baseball diamond container', () => {
      render(<PlayersSection />)

      const diamond = screen.getByTestId('players-diamond')
      expect(diamond).toBeInTheDocument()
      expect(diamond.className).toContain('baseballDiamond')
    })
  })
})