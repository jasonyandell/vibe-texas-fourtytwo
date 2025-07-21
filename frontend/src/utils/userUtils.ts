import { useMemo } from 'react';

/**
 * Generate a stable user ID for the current session
 * In production, this would come from auth context
 */
export const generateUserId = (): string => {
  const storedId = sessionStorage.getItem('texas42-user-id');
  if (storedId) {
    return storedId;
  }
  const newId = `user-${Date.now()}`;
  sessionStorage.setItem('texas42-user-id', newId);
  return newId;
};

/**
 * Hook to get current user ID
 * TODO: Replace with actual auth context in production
 */
export const useCurrentUserId = (): string => {
  return useMemo(() => generateUserId(), []);
};

/**
 * Get the current user name
 * TODO: Get actual user name from auth context
 */
export const getCurrentUserName = (): string => {
  return 'Player 1';
};