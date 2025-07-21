import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../../DominoHand'
import { createDomino } from '@/types/texas42'

describe('DominoHand Accessibility', () => {
  const mockHand = Array.from({ length: 7 }, (_, i) =>
    createDomino(Math.floor(i / 2), i % 2)
  )

  it('groups dominoes with proper role and label', () => {
    const { container } = render(<DominoHand dominoes={mockHand} />)
    
    const handGroup = container.firstChild as HTMLElement
    expect(handGroup).toHaveAttribute('role', 'group')
    expect(handGroup).toHaveAttribute('aria-label', 'Domino hand with 7 dominoes')
  })

  it('provides meaningful labels for empty hands', () => {
    const { container } = render(<DominoHand dominoes={[]} />)
    
    const handGroup = container.firstChild as HTMLElement
    expect(handGroup).toHaveAttribute('aria-label', 'Empty domino hand')
  })

  it('hides gap elements from screen readers', () => {
    const handWithGaps = [mockHand[0], null, mockHand[1]]
    const { container } = render(<DominoHand dominoes={handWithGaps} />)
    
    const gaps = container.querySelectorAll('.domino-gap')
    gaps.forEach(gap => {
      expect(gap).toHaveAttribute('aria-hidden', 'true')
    })
  })
})