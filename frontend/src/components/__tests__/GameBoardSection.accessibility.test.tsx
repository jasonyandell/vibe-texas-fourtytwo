import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameBoardSection } from '../GameBoardSection'

describe('GameBoardSection - Accessibility', () => {
  describe('Accessibility', () => {
    it('has proper ARIA attributes for interactive elements', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByRole('region', { name: 'Current trick display' })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: 'Dominoes in current trick' })).toBeInTheDocument()
    })

    it('provides screen reader announcements', () => {
      render(<GameBoardSection />)
      
      expect(screen.getByTestId('trick-announcer')).toBeInTheDocument()
      expect(screen.getByTestId('trick-announcer')).toHaveTextContent(
        'Current trick: Opening Trick. First trick of the hand with mixed suits. Winner: North.'
      )
    })

    it('updates announcements when trick changes', () => {
      render(<GameBoardSection />)
      
      // Click next trick
      fireEvent.click(screen.getByTestId('next-trick-button'))
      
      expect(screen.getByTestId('trick-announcer')).toHaveTextContent(
        'Current trick: Trump Trick. Trick won with trump dominoes (sixes). Winner: South.'
      )
    })
  })
})