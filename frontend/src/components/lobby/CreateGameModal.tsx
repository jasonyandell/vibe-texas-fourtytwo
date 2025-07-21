import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useModalKeyboardHandling } from './useModalKeyboardHandling';
import { validateGameName, isValidGameName, getServerErrorMessage, GAME_NAME_MAX_LENGTH } from './GameNameValidator';
import { CloseButton } from './CloseButton';
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { modalRef, handleBackdropClick } = useModalKeyboardHandling({
    onClose,
    isDisabled: isCreating
  });

  // Focus management
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Reset errors
    setValidationError(null);
    setServerError(null);
    
    // Validation
    const validation = validateGameName(gameName);
    if (!validation.isValid) {
      setValidationError(validation.error!);
      return;
    }

    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateGame(gameName.trim());
      onClose();
    } catch (error) {
      setServerError(getServerErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  const isValidName = isValidGameName(gameName);

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
          <CloseButton onClick={onClose} disabled={isCreating} />
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
              maxLength={GAME_NAME_MAX_LENGTH}
              required
              autoComplete="off"
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
