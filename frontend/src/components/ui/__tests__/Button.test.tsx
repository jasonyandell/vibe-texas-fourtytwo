import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('applies default variant and size classes', () => {
      render(<Button>Default Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button', 'primary', 'medium')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('applies primary variant class', () => {
      render(<Button variant="primary">Primary</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('primary')
    })

    it('applies secondary variant class', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('secondary')
    })

    it('applies danger variant class', () => {
      render(<Button variant="danger">Danger</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('danger')
    })

    it('applies ghost variant class', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('ghost')
    })
  })

  describe('Sizes', () => {
    it('applies small size class', () => {
      render(<Button size="small">Small</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('small')
    })

    it('applies medium size class', () => {
      render(<Button size="medium">Medium</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('medium')
    })

    it('applies large size class', () => {
      render(<Button size="large">Large</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('large')
    })
  })

  describe('States', () => {
    it('shows loading state', () => {
      render(<Button loading>Loading Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('loading')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()
      expect(screen.getByText('Loading Button')).toHaveClass('loadingText')
    })

    it('applies fullWidth class', () => {
      render(<Button fullWidth>Full Width</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('fullWidth')
    })

    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>)
      
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const mockOnClick = vi.fn()
      render(<Button onClick={mockOnClick}>Click me</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const mockOnClick = vi.fn()
      render(<Button onClick={mockOnClick} disabled>Disabled</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', () => {
      const mockOnClick = vi.fn()
      render(<Button onClick={mockOnClick} loading>Loading</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports custom ARIA attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })

    it('indicates loading state to screen readers', () => {
      render(<Button loading>Loading</Button>)
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('HTML Attributes', () => {
    it('forwards HTML button attributes', () => {
      render(
        <Button type="submit" form="test-form" data-testid="submit-btn">
          Submit
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('data-testid', 'submit-btn')
    })
  })
})
