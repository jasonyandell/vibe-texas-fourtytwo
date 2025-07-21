import { useState } from 'react'
import { Domino } from '@/types/texas42'

export const useDominoSelection = () => {
  const [selectedDominoes, setSelectedDominoes] = useState<Set<string>>(new Set())
  const [selectionAnnouncement, setSelectionAnnouncement] = useState('')

  const handleDominoClick = (domino: Domino) => {
    const newSelected = new Set(selectedDominoes)
    if (newSelected.has(domino.id)) {
      newSelected.delete(domino.id)
      setSelectionAnnouncement(`Deselected domino ${domino.high}-${domino.low}`)
    } else {
      newSelected.add(domino.id)
      setSelectionAnnouncement(`Selected domino ${domino.high}-${domino.low}`)
    }
    setSelectedDominoes(newSelected)
  }

  return {
    selectedDominoes,
    selectionAnnouncement,
    handleDominoClick
  }
}