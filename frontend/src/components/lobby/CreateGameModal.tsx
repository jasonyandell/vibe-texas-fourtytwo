import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import styles from './CreateGameModal.module.css';

export interface CreateGameModalProps {
  onCreateGame: (gameName: string) => void;
  onClose: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  onCreateGame,
  onClose
}) => {
  const [gameName, setGameName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!gameName.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateGame(gameName.trim());
      // Close modal after successful creation
      onClose();
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isValidName = gameName.trim().length >= 3 && gameName.trim().length <= 50;

  return (
    <div 
      className={styles.modalOverlay}
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-game-title"
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 id="create-game-title">Create New Game</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            disabled={isCreating}
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
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="game-name" className={styles.label}>
              Game Name
            </label>
            <input
              ref={inputRef}
              id="game-name"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter a name for your game..."
              className={styles.input}
              disabled={isCreating}
              maxLength={50}
              required
            />
            <div className={styles.inputHelp}>
              {gameName.length > 0 && (
                <span className={isValidName ? styles.validText : styles.errorText}>
                  {gameName.length}/50 characters
                  {!isValidName && ' (minimum 3 characters)'}
                </span>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValidName || isCreating}
              loading={isCreating}
            >
              Create Game
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
