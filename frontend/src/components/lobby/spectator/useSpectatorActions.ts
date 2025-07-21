import { useState, useCallback } from 'react';

interface UseSpectatorActionsProps {
  gameId: string;
  canJoinAsSpectator: boolean;
  onJoinSpectating?: (gameId: string) => Promise<void>;
  onLeaveSpectating?: (gameId: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useSpectatorActions = ({
  gameId,
  canJoinAsSpectator,
  onJoinSpectating,
  onLeaveSpectating,
  onError
}: UseSpectatorActionsProps) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinSpectating = useCallback(async () => {
    if (!onJoinSpectating || !canJoinAsSpectator) return;

    setIsJoining(true);
    setError(null);

    try {
      await onJoinSpectating(gameId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join as spectator';
      setError(errorMessage);
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsJoining(false);
    }
  }, [gameId, canJoinAsSpectator, onJoinSpectating, onError]);

  const handleLeaveSpectating = useCallback(async () => {
    if (!onLeaveSpectating) return;

    setIsLeaving(true);
    setError(null);

    try {
      await onLeaveSpectating(gameId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave spectating';
      setError(errorMessage);
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsLeaving(false);
    }
  }, [gameId, onLeaveSpectating, onError]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isJoining,
    isLeaving,
    error,
    handleJoinSpectating,
    handleLeaveSpectating,
    dismissError
  };
};