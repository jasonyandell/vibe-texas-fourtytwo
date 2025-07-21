import React from 'react';
import { SpectatorInfo as SpectatorInfoType } from './SpectatorView';
import {
  SpectatorInfo,
  SpectatorActions,
  SpectatorList,
  SpectatorHints,
  ErrorMessage,
  useSpectatorActions
} from './spectator';
import styles from './SpectatorManager.module.css';

export interface SpectatorManagerProps {
  gameId: string;
  spectators: SpectatorInfoType[];
  currentUserId?: string;
  isSpectating: boolean;
  canJoinAsSpectator: boolean;
  onJoinSpectating?: (gameId: string) => Promise<void>;
  onLeaveSpectating?: (gameId: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export const SpectatorManager: React.FC<SpectatorManagerProps> = ({
  gameId,
  spectators,
  currentUserId,
  isSpectating,
  canJoinAsSpectator,
  onJoinSpectating,
  onLeaveSpectating,
  onError
}) => {
  const {
    isJoining,
    isLeaving,
    error,
    handleJoinSpectating,
    handleLeaveSpectating,
    dismissError
  } = useSpectatorActions({
    gameId,
    canJoinAsSpectator,
    onJoinSpectating,
    onLeaveSpectating,
    onError
  });

  const getSpectatorButtonText = () => {
    if (isJoining) return 'Joining...';
    if (isLeaving) return 'Leaving...';
    if (isSpectating) return 'Stop Spectating';
    return 'Spectate Game';
  };

  return (
    <div className={styles.spectatorManager}>
      <SpectatorInfo
        spectators={spectators}
        currentUserId={currentUserId}
        isSpectating={isSpectating}
      />

      <ErrorMessage error={error} onDismiss={dismissError} />

      <SpectatorActions
        isSpectating={isSpectating}
        canJoinAsSpectator={canJoinAsSpectator}
        isJoining={isJoining}
        isLeaving={isLeaving}
        buttonText={getSpectatorButtonText()}
        onJoin={handleJoinSpectating}
        onLeave={handleLeaveSpectating}
      />

      <SpectatorList
        spectators={spectators}
        currentUserId={currentUserId}
      />

      <SpectatorHints />
    </div>
  );
};