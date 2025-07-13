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
}

export const LobbyList: React.FC<LobbyListProps> = ({
  games,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className={styles.lobbyList}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.lobbyList}>
        <div className={styles.errorState}>
          <h3>Unable to load games</h3>
          <p>{error.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={styles.lobbyList}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={styles.lobbyList}>
      <div className={styles.gameGrid}>
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
