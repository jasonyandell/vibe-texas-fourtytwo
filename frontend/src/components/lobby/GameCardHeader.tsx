import React from 'react';
import { LobbyGame } from '@/types/texas42';
import { GameStatus } from './GameStatus';
import styles from './GameCard.module.css';

interface GameCardHeaderProps {
  game: LobbyGame;
}

export const GameCardHeader: React.FC<GameCardHeaderProps> = ({ game }) => {
  return (
    <div className={`${styles.cardHeader} flex-between`}>
      <div className={styles.gameInfo}>
        <h3 className={styles.gameName}>{game.name}</h3>
        <div className={`${styles.gameMetadata} flex-column`}>
          <span className={styles.playerCount}>
            {game.playerCount}/{game.maxPlayers} players
          </span>
          <span className={styles.createdAt}>
            Created {new Date(game.createdAt).toLocaleTimeString()}
          </span>
          {game.gameCode && (
            <span className={styles.gameCode} data-testid="game-code">
              {game.gameCode}
            </span>
          )}
        </div>
      </div>
      <div data-testid="game-status">
        <GameStatus status={game.status} />
      </div>
    </div>
  );
};