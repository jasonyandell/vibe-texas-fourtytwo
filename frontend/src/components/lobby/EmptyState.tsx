import React from 'react';
import { Button } from '@/components/ui';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  onCreateGame?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateGame
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      
      <p>No games available. Create one to get started!</p>
      
      {onCreateGame && (
        <Button 
          variant="primary" 
          onClick={onCreateGame}
          className={styles.createButton}
        >
          Create New Game
        </Button>
      )}
    </div>
  );
};
