import { useState } from 'react'
import { DominoSuit } from '@/types/texas42'
import { validateBidAmount } from '@/utils/biddingSectionUtils'

export const useBiddingSectionState = () => {
  const [selectedTrumpSuit, setSelectedTrumpSuit] = useState<DominoSuit | null>(null)
  const [bidAmount, setBidAmount] = useState<number>(30)
  const [selectedBidTrump, setSelectedBidTrump] = useState<DominoSuit | ''>('')
  const [validationError, setValidationError] = useState<string>('')

  const handleTrumpSuitClick = (suit: DominoSuit) => {
    setSelectedTrumpSuit(selectedTrumpSuit === suit ? null : suit)
  }

  const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      setBidAmount(value)
      validateBid(value)
    }
  }

  const handleBidTrumpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trump = event.target.value as DominoSuit | ''
    setSelectedBidTrump(trump)
    if (trump) {
      setValidationError('')
    }
  }

  const validateBid = (amount: number): string => {
    const error = validateBidAmount(amount, 35)
    setValidationError(error)
    return error
  }

  const handleSampleBid = () => {
    const amountError = validateBid(bidAmount)
    if (amountError) return
    
    if (!selectedBidTrump) {
      setValidationError('Must select trump suit')
      return
    }
    
    setValidationError('')
    console.log(`Sample bid: ${bidAmount} with ${selectedBidTrump} trump`)
  }

  return {
    selectedTrumpSuit,
    bidAmount,
    selectedBidTrump,
    validationError,
    handleTrumpSuitClick,
    handleBidAmountChange,
    handleBidTrumpChange,
    handleSampleBid,
  }
}