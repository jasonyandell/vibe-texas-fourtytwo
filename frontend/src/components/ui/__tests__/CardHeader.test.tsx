import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardHeader } from '../Card'

describe('CardHeader', () => {
  it('renders header content', () => {
    render(<CardHeader>Header content</CardHeader>)
    
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('applies header class', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    
    expect(container.firstChild).toHaveClass('cardHeader')
  })

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>)
    
    expect(container.firstChild).toHaveClass('cardHeader', 'custom-header')
  })
})