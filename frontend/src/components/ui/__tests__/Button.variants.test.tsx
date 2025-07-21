import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button - Variants', () => {
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