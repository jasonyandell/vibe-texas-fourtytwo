import { useCallback } from 'react';

interface GameActionHandlers {
  onJoinGame?: (gameId: string) => void;
  onLeaveGame?: (gameId: string) => void;
  onSpectateGame?: (gameId: string) => void;
  onMarkReady?: (gameId: string) => void;
}

interface GameActions {
  handleJoin: () => void;
  handleLeave: () => void;
  handleSpectate: () => void;
  handleMarkReady: () => void;
}

export function useGameActions(
  gameId: string,
  handlers: GameActionHandlers,
  permissions: {
    canJoin: boolean;
    isUserInGame: boolean;
    canSpectate: boolean;
    canMarkReady: boolean;
  }
): GameActions {
  const handleJoin = useCallback(() => {
    if (handlers.onJoinGame && permissions.canJoin) {
      handlers.onJoinGame(gameId);
    }
  }, [handlers.onJoinGame, permissions.canJoin, gameId]);

  const handleLeave = useCallback(() => {
    if (handlers.onLeaveGame && permissions.isUserInGame) {
      handlers.onLeaveGame(gameId);
    }
  }, [handlers.onLeaveGame, permissions.isUserInGame, gameId]);

  const handleSpectate = useCallback(() => {
    if (handlers.onSpectateGame && permissions.canSpectate) {
      handlers.onSpectateGame(gameId);
    }
  }, [handlers.onSpectateGame, permissions.canSpectate, gameId]);

  const handleMarkReady = useCallback(() => {
    if (handlers.onMarkReady && permissions.canMarkReady) {
      handlers.onMarkReady(gameId);
    }
  }, [handlers.onMarkReady, permissions.canMarkReady, gameId]);

  return {
    handleJoin,
    handleLeave,
    handleSpectate,
    handleMarkReady
  };
}