import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

  describe('Player Information', () => {
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

  describe('Partnership System', () => {
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

  describe('Hand Visibility Controls', () => {
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

  describe('Interactive Controls', () => {
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

  describe('Responsive Design', () => {
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

  describe('Accessibility', () => {
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
})
