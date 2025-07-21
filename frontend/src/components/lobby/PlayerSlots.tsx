import React from 'react';
import { PlayerSlot } from './PlayerSlot';
import { PartnershipsDisplay } from './PartnershipsDisplay';
import { POSITIONS, PARTNERSHIPS } from './constants';
import type { PlayerSlotsProps } from './types';
import styles from './PlayerSlots.module.css';

export const PlayerSlots: React.FC<PlayerSlotsProps> = ({
  players,
  currentUserId,
  gameStatus,
  onJoinSlot
}) => {
  return (
    <div className={styles.playerSlots}>
      <div className={styles.slotsHeader}>
        <h4>Players</h4>
        <PartnershipsDisplay players={players} partnerships={PARTNERSHIPS} />
      </div>

      <div className={styles.slotsGrid}>
        {players.map((player, index) => (
          <PlayerSlot
            key={index}
            player={player}
            index={index}
            position={POSITIONS[index]}
            currentUserId={currentUserId}
            gameStatus={gameStatus}
            onJoinSlot={onJoinSlot}
          />
        ))}
      </div>
    </div>
  );
};
