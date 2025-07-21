import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardContent } from '../Card'

describe('CardContent', () => {
  it('renders content', () => {
    render(<CardContent>Main content</CardContent>)
    
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('applies content class', () => {
    const { container } = render(<CardContent>Content</CardContent>)
    
    expect(container.firstChild).toHaveClass('cardContent')
  })

  it('applies custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>)
    
    expect(container.firstChild).toHaveClass('cardContent', 'custom-content')
  })
})