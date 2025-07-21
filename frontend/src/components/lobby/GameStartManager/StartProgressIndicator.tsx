import React from 'react';
import styles from '../GameStartManager.module.css';

const PROGRESS_STEPS = [
  { icon: '⚙️', text: 'Initializing game...' },
  { icon: '🎲', text: 'Shuffling dominoes...' },
  { icon: '🃏', text: 'Dealing hands...' },
  { icon: '🎯', text: 'Starting bidding...' }
];

export const StartProgressIndicator: React.FC = () => {
  return (
    <div className={styles.startingProgress}>
      <div className={styles.progressSteps}>
        {PROGRESS_STEPS.map((step, index) => (
          <div key={index} className={styles.progressStep}>
            <span className={styles.stepIcon}>{step.icon}</span>
            <span>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};