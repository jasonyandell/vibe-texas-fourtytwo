import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button - Sizes', () => {
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