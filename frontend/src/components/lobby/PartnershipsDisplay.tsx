import React from 'react';
import type { Player } from './types';
import styles from './PlayerSlots.module.css';

interface Partnership {
  team: string;
  positions: number[];
}

interface PartnershipsDisplayProps {
  players: (Player | null)[];
  partnerships: Partnership[];
}

export const PartnershipsDisplay: React.FC<PartnershipsDisplayProps> = ({
  players,
  partnerships
}) => (
  <div className={styles.partnerships}>
    {partnerships.map((partnership, index) => (
      <div key={index} className={styles.partnership}>
        <span className={styles.teamName}>{partnership.team}</span>
        <div className={styles.teamMembers}>
          {partnership.positions.map(pos => {
            const player = players[pos];
            return (
              <span key={pos} className={styles.teamMember}>
                {player ? player.name : 'Empty'}
              </span>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);