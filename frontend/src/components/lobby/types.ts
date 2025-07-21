export interface Player {
  id: string;
  name: string;
  position: 'north' | 'east' | 'south' | 'west';
  isReady: boolean;
}

export interface PlayerSlotsProps {
  players: (Player | null)[];
  currentUserId?: string;
  gameStatus: 'waiting' | 'playing' | 'finished';
  onJoinSlot?: (position: number) => void;
}

export interface PlayerSlotProps {
  player: Player | null;
  index: number;
  position: string;
  currentUserId?: string;
  gameStatus: 'waiting' | 'playing' | 'finished';
  onJoinSlot?: (position: number) => void;
}