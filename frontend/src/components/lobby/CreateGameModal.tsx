import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import styles from './CreateGameModal.module.css';

export interface CreateGameModalProps {
  onCreateGame: (gameName: string) => void | Promise<void>;
  onClose: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  onCreateGame,
  onClose
}) => {
  const [gameName, setGameName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
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
      if (event.key === 'Escape' && !isCreating) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isCreating]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current && !isCreating) {
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = gameName.trim();
    
    // Reset errors
    setValidationError(null);
    setServerError(null);
    
    // Validation
    if (!trimmedName) {
      setValidationError('Game name is required');
      return;
    }
    if (trimmedName.length < 3) {
      setValidationError('Game name must be at least 3 characters');
      return;
    }
    if (trimmedName.length > 50) {
      setValidationError('Game name must be less than 50 characters');
      return;
    }

    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateGame(trimmedName);
      onClose(); // Close modal after successful creation
    } catch (error) {
      // Handle server errors
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('exists')) {
          setServerError('A game with this name already exists');
        } else {
          setServerError('Failed to create game. Please try again.');
        }
      } else {
        setServerError('Failed to create game. Please try again.');
      }
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

        <form onSubmit={(e) => void handleSubmit(e)} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="game-name" className={styles.label}>
              Game Name
            </label>
            <input
              ref={inputRef}
              id="game-name"
              type="text"
              value={gameName}
              onChange={(e) => {
                setGameName((e.target as HTMLInputElement).value);
                setValidationError(null);
                setServerError(null);
              }}
              placeholder="Enter a name for your game..."
              className={styles.input}
              disabled={isCreating}
              maxLength={51} // Allow one extra to trigger validation
              required
            />
            <div className={styles.inputHelp}>
              {gameName.length > 0 && !validationError && !serverError && (
                <span className={isValidName ? styles.validText : styles.errorText}>
                  {gameName.length}/50 characters
                  {!isValidName && ' (minimum 3 characters)'}
                </span>
              )}
            </div>
          </div>
          
          {(validationError || serverError) && (
            <div role="alert" className={styles.errorMessage}>
              {validationError || serverError}
            </div>
          )}

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
