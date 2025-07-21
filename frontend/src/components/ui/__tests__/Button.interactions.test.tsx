import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button - Interactions', () => {
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