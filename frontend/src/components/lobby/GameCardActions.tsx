import React from 'react';
import { LobbyGame } from '@/types/texas42';
import { Button, Badge } from '@/components/ui';
import styles from './GameCard.module.css';

interface GameCardActionsProps {
  game: LobbyGame;
  permissions: {
    canJoin: boolean;
    isUserInGame: boolean;
    canSpectate: boolean;
    canMarkReady: boolean;
    allPlayersReady: boolean;
  };
  actions: {
    handleJoin: () => void;
    handleLeave: () => void;
    handleSpectate: () => void;
    handleMarkReady: () => void;
  };
}

export const GameCardActions: React.FC<GameCardActionsProps> = ({ 
  game, 
  permissions, 
  actions 
}) => {
  return (
    <div className={`${styles.cardActions} flex-column`}>
      {permissions.canJoin && (
        <Button 
          variant="primary" 
          size="small" 
          onClick={actions.handleJoin}
          fullWidth
        >
          Join Game
        </Button>
      )}

      {permissions.isUserInGame && game.status === 'waiting' && (
        <div className={`${styles.playerActions} flex`}>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={actions.handleLeave}
          >
            Leave Game
          </Button>
          {permissions.canMarkReady && (
            <Button 
              variant="primary" 
              size="small" 
              onClick={actions.handleMarkReady}
              disabled={permissions.allPlayersReady}
            >
              {permissions.allPlayersReady ? 'All Ready!' : 'Ready'}
            </Button>
          )}
        </div>
      )}

      {permissions.canSpectate && (
        <Button 
          variant="ghost" 
          size="small" 
          onClick={actions.handleSpectate}
          fullWidth
        >
          Spectate
        </Button>
      )}

      {game.status === 'finished' && (
        <Badge variant="secondary" className={styles.finishedBadge}>
          Game Completed
        </Badge>
      )}
    </div>
  );
};