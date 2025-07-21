export const GAME_NAME_MIN_LENGTH = 3;
export const GAME_NAME_MAX_LENGTH = 50;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateGameName(name: string): ValidationResult {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Game name is required' };
  }
  
  if (trimmedName.length < GAME_NAME_MIN_LENGTH) {
    return { isValid: false, error: `Game name must be at least ${GAME_NAME_MIN_LENGTH} characters` };
  }
  
  if (trimmedName.length > GAME_NAME_MAX_LENGTH) {
    return { isValid: false, error: `Game name must be less than ${GAME_NAME_MAX_LENGTH} characters` };
  }
  
  return { isValid: true };
}

export function isValidGameName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= GAME_NAME_MIN_LENGTH && trimmed.length <= GAME_NAME_MAX_LENGTH;
}

export function getServerErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('duplicate') || error.message.includes('exists')) {
      return 'A game with this name already exists';
    }
  }
  return 'Failed to create game. Please try again.';
}