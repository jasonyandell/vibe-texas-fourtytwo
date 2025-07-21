import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('renders card with content', () => {
      render(<Card>Card content</Card>)
      
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default variant and padding classes', () => {
      const { container } = render(<Card>Content</Card>)
      
      expect(container.firstChild).toHaveClass('card', 'default', 'paddingMedium')
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const { container } = render(<Card variant="default">Content</Card>)
      
      expect(container.firstChild).toHaveClass('default')
    })

    it('applies elevated variant class', () => {
      const { container } = render(<Card variant="elevated">Content</Card>)
      
      expect(container.firstChild).toHaveClass('elevated')
    })

    it('applies outlined variant class', () => {
      const { container } = render(<Card variant="outlined">Content</Card>)
      
      expect(container.firstChild).toHaveClass('outlined')
    })

    it('applies filled variant class', () => {
      const { container } = render(<Card variant="filled">Content</Card>)
      
      expect(container.firstChild).toHaveClass('filled')
    })
  })

  describe('Padding', () => {
    it('applies none padding class', () => {
      const { container } = render(<Card padding="none">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingNone')
    })

    it('applies small padding class', () => {
      const { container } = render(<Card padding="small">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingSmall')
    })

    it('applies medium padding class', () => {
      const { container } = render(<Card padding="medium">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingMedium')
    })

    it('applies large padding class', () => {
      const { container } = render(<Card padding="large">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingLarge')
    })
  })

  describe('HTML Attributes', () => {
    it('forwards HTML div attributes', () => {
      const { container } = render(
        <Card data-testid="test-card" role="region" aria-label="Test card">
          Content
        </Card>
      )
      
      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('data-testid', 'test-card')
      expect(card).toHaveAttribute('role', 'region')
      expect(card).toHaveAttribute('aria-label', 'Test card')
    })
  })
})