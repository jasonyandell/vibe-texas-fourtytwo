import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { Header } from '../Header'

describe('Header Component', () => {
  it('renders the Texas 42 title', () => {
    render(<Header />)
    
    expect(screen.getByText('Texas 42')).toBeInTheDocument()
    expect(screen.getByText('Authentic Domino Game')).toBeInTheDocument()
  })

  it('has the correct CSS class', () => {
    const { container } = render(<Header />)
    
    expect(container.firstChild).toHaveClass('game-header')
  })
})
