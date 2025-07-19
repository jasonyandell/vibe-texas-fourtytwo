import React from 'react';
import { LobbyGame } from '@/types/texas42';
import { Card, Button, Badge } from '@/components/ui';
import { PlayerSlots } from './PlayerSlots';
import { GameStatus } from './GameStatus';
import { ScoreDisplay } from './ScoreDisplay';
import styles from './GameCard.module.css';

export interface GameCardProps {
  game: LobbyGame;
  currentUserId?: string;
  onJoinGame?: (gameId: string) => void;
  onLeaveGame?: (gameId: string) => void;
  onSpectateGame?: (gameId: string) => void;
  onMarkReady?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  currentUserId,
  onJoinGame,
  onLeaveGame,
  onSpectateGame,
  onMarkReady
}) => {
  // Mock player data - in real implementation this would come from game state
  const mockPlayers = [
    { id: 'player1', name: 'Alice', position: 'north' as const, isReady: true },
    { id: 'player2', name: 'Bob', position: 'east' as const, isReady: false },
    null, // Empty slot
    { id: 'player4', name: 'Charlie', position: 'west' as const, isReady: true }
  ];

  // Mock scores - in real implementation this would come from game state
  const mockScores = {
    northSouth: 3,
    eastWest: 1
  };

  const isUserInGame = mockPlayers.some(player => player?.id === currentUserId);
  const canJoin = game.status === 'waiting' && game.playerCount < game.maxPlayers && !isUserInGame;
  const canSpectate = game.status === 'playing';
  const allPlayersReady = mockPlayers.filter(p => p !== null).every(p => p?.isReady);
  const canMarkReady = isUserInGame && game.status === 'waiting' && game.playerCount === 4;

  const handleJoin = () => {
    if (onJoinGame && canJoin) {
      onJoinGame(game.id);
    }
  };

  const handleLeave = () => {
    if (onLeaveGame && isUserInGame) {
      onLeaveGame(game.id);
    }
  };

  const handleSpectate = () => {
    if (onSpectateGame && canSpectate) {
      onSpectateGame(game.id);
    }
  };

  const handleMarkReady = () => {
    if (onMarkReady && canMarkReady) {
      onMarkReady(game.id);
    }
  };

  return (
    <Card variant="elevated" className={styles.gameCard}>
      <div className={styles.cardHeader}>
        <div className={styles.gameInfo}>
          <h3 className={styles.gameName}>{game.name}</h3>
          <div className={styles.gameMetadata}>
            <span className={styles.playerCount}>
              {game.playerCount}/{game.maxPlayers} players
            </span>
            <span className={styles.createdAt}>
              Created {new Date(game.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <GameStatus status={game.status} />
      </div>

      {game.status === 'playing' && (
        <ScoreDisplay scores={mockScores} />
      )}

      <PlayerSlots 
        players={mockPlayers}
        currentUserId={currentUserId}
        gameStatus={game.status}
        onJoinSlot={handleJoin}
      />

      <div className={styles.cardActions}>
        {canJoin && (
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleJoin}
            fullWidth
          >
            Join Game
          </Button>
        )}

        {isUserInGame && game.status === 'waiting' && (
          <div className={styles.playerActions}>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={handleLeave}
            >
              Leave Game
            </Button>
            {canMarkReady && (
              <Button 
                variant="primary" 
                size="small" 
                onClick={handleMarkReady}
                disabled={allPlayersReady}
              >
                {allPlayersReady ? 'All Ready!' : 'Ready'}
              </Button>
            )}
          </div>
        )}

        {canSpectate && (
          <Button 
            variant="ghost" 
            size="small" 
            onClick={handleSpectate}
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
    </Card>
  );
};
