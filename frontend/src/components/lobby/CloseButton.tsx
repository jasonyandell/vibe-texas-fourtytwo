import React from 'react';
import styles from './CreateGameModal.module.css';

export interface CloseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      className={styles.closeButton}
      onClick={onClick}
      aria-label="Close modal"
      disabled={disabled}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );
};