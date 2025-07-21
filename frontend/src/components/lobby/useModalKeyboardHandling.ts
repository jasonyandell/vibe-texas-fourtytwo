import React, { useEffect, useRef } from 'react';

export interface UseModalKeyboardHandlingOptions {
  onClose: () => void;
  isDisabled?: boolean;
}

export function useModalKeyboardHandling({
  onClose,
  isDisabled = false
}: UseModalKeyboardHandlingOptions) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDisabled) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isDisabled]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current && !isDisabled) {
      onClose();
    }
  };

  return {
    modalRef,
    handleBackdropClick
  };
}