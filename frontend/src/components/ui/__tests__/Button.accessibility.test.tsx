import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button - Accessibility', () => {
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