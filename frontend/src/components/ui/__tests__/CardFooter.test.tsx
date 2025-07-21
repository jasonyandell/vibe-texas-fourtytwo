import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CardFooter } from '../Card'

describe('CardFooter', () => {
  it('renders footer content', () => {
    render(<CardFooter>Footer content</CardFooter>)
    
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies footer class', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    
    expect(container.firstChild).toHaveClass('cardFooter')
  })

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>)
    
    expect(container.firstChild).toHaveClass('cardFooter', 'custom-footer')
  })
})