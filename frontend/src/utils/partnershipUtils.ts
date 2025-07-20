import { PlayerPosition } from '@/types/texas42'

export type Partnership = 'north-south' | 'east-west'

export const getPartnership = (position: PlayerPosition): Partnership => {
  return position === 'north' || position === 'south' ? 'north-south' : 'east-west'
}

export const getPartnershipName = (partnership: Partnership): string => {
  return partnership === 'north-south' ? 'North-South' : 'East-West'
}