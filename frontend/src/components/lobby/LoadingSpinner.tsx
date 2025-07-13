import React from 'react';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading games...'
}) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true">
        <div className={styles.spinnerInner}></div>
      </div>
      <p className={styles.loadingMessage} aria-live="polite">
        {message}
      </p>
    </div>
  );
};
