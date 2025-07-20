import React from 'react';
import { LobbyGame } from '@/types/texas42';
import { GameCard } from './GameCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import styles from './LobbyList.module.css';

export interface LobbyListProps {
  games: LobbyGame[];
  loading?: boolean;
  error?: Error | null;
  onCreateGame?: () => void;
}

export const LobbyList: React.FC<LobbyListProps> = ({
  games,
  loading = false,
  error = null,
  onCreateGame
}) => {
  // Error takes precedence over loading
  if (error) {
    return (
      <div className={styles.lobbyList} data-testid="lobby-list">
        <div className={styles.errorState} data-testid="error-state">
          <h3 role="heading">Unable to load games</h3>
          <p>{error.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.lobbyList} data-testid="lobby-list">
        <LoadingSpinner />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={styles.lobbyList} data-testid="lobby-list">
        <EmptyState onCreateGame={onCreateGame} />
      </div>
    );
  }

  return (
    <div className={styles.lobbyList} data-testid="lobby-list">
      <div className={styles.gameGrid} data-testid="game-grid">
        {games.map(game => (
          <GameCard 
            key={game.id} 
            game={game}
          />
        ))}
      </div>
    </div>
  );
};
