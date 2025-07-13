import React from 'react';
import { Domino } from '@/types/texas42';

interface DominoComponentProps {
  domino: Domino;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const DominoComponent: React.FC<DominoComponentProps> = ({
  domino,
  onClick,
  isPlayable = false,
  className = ''
}) => {
  return (
    <div 
      className={`domino ${isPlayable ? 'playable' : ''} ${className}`}
      onClick={onClick}
      data-testid={`domino-${domino.high}-${domino.low}`}
    >
      <div className="domino-half domino-high">
        {Array.from({ length: domino.high }, (_, i) => (
          <div key={i} className="pip" />
        ))}
      </div>
      <div className="domino-divider" />
      <div className="domino-half domino-low">
        {Array.from({ length: domino.low }, (_, i) => (
          <div key={i} className="pip" />
        ))}
      </div>
    </div>
  );
};
