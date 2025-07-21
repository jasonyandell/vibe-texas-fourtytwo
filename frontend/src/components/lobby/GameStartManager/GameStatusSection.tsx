import React from 'react';
import { Player } from '@/types/texas42';
import { Badge } from '@/components/ui';
import styles from '../GameStartManager.module.css';

interface GameStatusSectionProps {
  players: (Player | null)[];
}

export const GameStatusSection: React.FC<GameStatusSectionProps> = ({ players }) => {
  const activePlayers = players.filter(p => p !== null);
  const readyPlayers = activePlayers.filter(p => p.isReady);

  const getStatusBadge = () => {
    if (activePlayers.length < 4) {
      return (
        <Badge variant="warning">
          {activePlayers.length}/4 Players
        </Badge>
      );
    }

    if (readyPlayers.length < 4) {
      return (
        <Badge variant="warning">
          {readyPlayers.length}/4 Ready
        </Badge>
      );
    }

    return (
      <Badge variant="success">
        All Players Ready!
      </Badge>
    );
  };

  return (
    <div className={styles.statusSection} data-testid="status-section">
      <div className={styles.statusHeader}>
        <h4>Game Status</h4>
        {getStatusBadge()}
      </div>

      {activePlayers.length === 4 && (
        <div className={styles.readyBreakdown}>
          <div className={styles.readyGrid} data-testid="ready-grid">
            {activePlayers.map(player => (
              <div 
                key={player.id}
                className={`${styles.playerStatus} ${player.isReady ? styles.ready : styles.notReady}`}
                data-testid={`player-status-${player.id}`}
              >
                <span className={styles.playerName}>{player.name}</span>
                <span className={styles.readyIndicator}>
                  {player.isReady ? '✓' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};