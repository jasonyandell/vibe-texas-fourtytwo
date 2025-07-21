import React from 'react';
import { LobbyGame } from '@/types/texas42';
import { Card } from '@/components/ui';
import { PlayerSlots } from './PlayerSlots';
import { ScoreDisplay } from './ScoreDisplay';
import { GameCardHeader } from './GameCardHeader';
import { GameCardActions } from './GameCardActions';
import { useGamePermissions } from './hooks/useGamePermissions';
import { useGameActions } from './hooks/useGameActions';
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
  // Use actual game data when available, fall back to mock data for testing
  const actualPlayers = game.players || [];
  const mockPlayers = [
    { id: 'player1', name: 'Alice', position: 'north' as const, isReady: true },
    { id: 'player2', name: 'Bob', position: 'east' as const, isReady: false },
    null, // Empty slot
    { id: 'player4', name: 'Charlie', position: 'west' as const, isReady: true }
  ];

  // Use actual players for permission calculations if available
  // Map actualPlayers to ensure isReady is always a boolean
  const playersForPermissions = actualPlayers.length > 0 
    ? actualPlayers.map(p => ({ ...p, isReady: p.isReady ?? false }))
    : mockPlayers;

  // Mock scores - in real implementation this would come from game state
  const mockScores = {
    northSouth: 3,
    eastWest: 1
  };

  const permissions = useGamePermissions(game, currentUserId, playersForPermissions);
  const actions = useGameActions(game.id, {
    onJoinGame,
    onLeaveGame,
    onSpectateGame,
    onMarkReady
  }, permissions);

  return (
    <Card variant="elevated" className={styles.gameCard} data-testid="game-card">
      <GameCardHeader game={game} />

      {game.status === 'playing' && (
        <div data-testid="score-display">
          <ScoreDisplay scores={mockScores} />
        </div>
      )}

      <div data-testid="player-slots">
        <PlayerSlots 
          players={mockPlayers}
          currentUserId={currentUserId}
          gameStatus={game.status}
          onJoinSlot={actions.handleJoin}
        />
      </div>

      <GameCardActions 
        game={game}
        permissions={permissions}
        actions={actions}
      />
    </Card>
  );
};