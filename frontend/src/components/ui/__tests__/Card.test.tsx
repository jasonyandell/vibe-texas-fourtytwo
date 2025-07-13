import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('renders card with content', () => {
      render(<Card>Card content</Card>)
      
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default variant and padding classes', () => {
      const { container } = render(<Card>Content</Card>)
      
      expect(container.firstChild).toHaveClass('card', 'default', 'paddingMedium')
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const { container } = render(<Card variant="default">Content</Card>)
      
      expect(container.firstChild).toHaveClass('default')
    })

    it('applies elevated variant class', () => {
      const { container } = render(<Card variant="elevated">Content</Card>)
      
      expect(container.firstChild).toHaveClass('elevated')
    })

    it('applies outlined variant class', () => {
      const { container } = render(<Card variant="outlined">Content</Card>)
      
      expect(container.firstChild).toHaveClass('outlined')
    })

    it('applies filled variant class', () => {
      const { container } = render(<Card variant="filled">Content</Card>)
      
      expect(container.firstChild).toHaveClass('filled')
    })
  })

  describe('Padding', () => {
    it('applies none padding class', () => {
      const { container } = render(<Card padding="none">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingNone')
    })

    it('applies small padding class', () => {
      const { container } = render(<Card padding="small">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingSmall')
    })

    it('applies medium padding class', () => {
      const { container } = render(<Card padding="medium">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingMedium')
    })

    it('applies large padding class', () => {
      const { container } = render(<Card padding="large">Content</Card>)
      
      expect(container.firstChild).toHaveClass('paddingLarge')
    })
  })

  describe('HTML Attributes', () => {
    it('forwards HTML div attributes', () => {
      const { container } = render(
        <Card data-testid="test-card" role="region" aria-label="Test card">
          Content
        </Card>
      )
      
      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('data-testid', 'test-card')
      expect(card).toHaveAttribute('role', 'region')
      expect(card).toHaveAttribute('aria-label', 'Test card')
    })
  })
})

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

describe('Card Composition', () => {
  it('renders complete card with all sections', () => {
    render(
      <Card>
        <CardHeader>Card Title</CardHeader>
        <CardContent>Card body content</CardContent>
        <CardFooter>Card actions</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card body content')).toBeInTheDocument()
    expect(screen.getByText('Card actions')).toBeInTheDocument()
  })
})
