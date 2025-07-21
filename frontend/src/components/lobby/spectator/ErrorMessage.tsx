import React from 'react';
import { Button, Badge } from '@/components/ui';
import styles from '../SpectatorManager.module.css';

interface ErrorMessageProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className={styles.errorMessage}>
      <Badge variant="danger">Error: {error}</Badge>
      <Button
        variant="ghost"
        size="small"
        onClick={onDismiss}
      >
        Dismiss
      </Button>
    </div>
  );
};