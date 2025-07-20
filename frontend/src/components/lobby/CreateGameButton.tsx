import React from 'react';
import { Button } from '@/components/ui';

interface CreateGameButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const CreateGameButton: React.FC<CreateGameButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  size = 'medium'
}) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      size={size}
    >
      Create Game
    </Button>
  );
};