import React from 'react';
import styles from '../SpectatorManager.module.css';

export const SpectatorHints: React.FC = () => {
  return (
    <div className={styles.spectatorHints}>
      <div className={styles.hint}>
        <span className={styles.hintIcon}>👁️</span>
        <span>Spectators can view all player hands and game state</span>
      </div>
      <div className={styles.hint}>
        <span className={styles.hintIcon}>🔄</span>
        <span>Seamlessly switch between spectating and playing</span>
      </div>
    </div>
  );
};