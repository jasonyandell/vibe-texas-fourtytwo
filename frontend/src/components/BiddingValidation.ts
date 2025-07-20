import { Bid } from '@/types/texas42';

export const validateBidAmount = (amount: number, currentBid: Bid | null): string => {
  if (amount < 30 || amount > 42) {
    return 'Bid must be between 30 and 42';
  }
  if (currentBid && amount <= currentBid.amount) {
    return 'Bid must be higher than current bid';
  }
  return '';
};

export const validateTrumpSelection = (selectedTrump: string): string => {
  if (!selectedTrump) {
    return 'Must select trump suit';
  }
  return '';
};

export const getMinimumValidBid = (currentBid: Bid | null, minimumBid: number): number => {
  return currentBid ? currentBid.amount + 1 : minimumBid;
};