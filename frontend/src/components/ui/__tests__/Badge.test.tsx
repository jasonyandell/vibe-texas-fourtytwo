import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('renders badge with text', () => {
      render(<Badge>Test Badge</Badge>)
      
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('applies default variant and size', () => {
      render(<Badge>Default</Badge>)
      
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('badge')
      expect(badge).toHaveClass('default')
      expect(badge).toHaveClass('medium')
    })

    it('applies custom className', () => {
      render(<Badge className="custom-class">Custom</Badge>)
      
      const badge = screen.getByText('Custom')
      expect(badge).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const

    variants.forEach(variant => {
      it(`applies ${variant} variant class`, () => {
        render(<Badge variant={variant}>{variant}</Badge>)
        
        const badge = screen.getByText(variant)
        expect(badge).toHaveClass(variant)
      })
    })
  })

  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        render(<Badge size={size}>{size}</Badge>)
        
        const badge = screen.getByText(size)
        expect(badge).toHaveClass(size)
      })
    })
  })

  describe('HTML Attributes', () => {
    it('forwards HTML attributes', () => {
      render(<Badge data-testid="test-badge" title="Test Title">Badge</Badge>)
      
      const badge = screen.getByTestId('test-badge')
      expect(badge).toHaveAttribute('title', 'Test Title')
    })

    it('renders as span element', () => {
      render(<Badge>Badge</Badge>)
      
      const badge = screen.getByText('Badge')
      expect(badge.tagName).toBe('SPAN')
    })
  })

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(<Badge aria-label="Status badge" role="status">Active</Badge>)
      
      const badge = screen.getByText('Active')
      expect(badge).toHaveAttribute('aria-label', 'Status badge')
      expect(badge).toHaveAttribute('role', 'status')
    })
  })
})
