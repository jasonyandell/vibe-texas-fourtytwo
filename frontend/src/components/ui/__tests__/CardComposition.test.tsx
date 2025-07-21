import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'

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