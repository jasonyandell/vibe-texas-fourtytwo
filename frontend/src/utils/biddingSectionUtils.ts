// Validate bid amount
export const validateBidAmount = (amount: number, highestBid: number = 35): string => {
  if (amount < 30 || amount > 42) {
    return 'Bid must be between 30 and 42'
  }
  
  // Check against current highest bid
  if (amount <= highestBid) {
    return `Bid must be higher than current bid (${highestBid})`
  }
  
  return ''
}