import React from 'react';
import { Domino } from '@/types/texas42';
import { DominoComponent } from './DominoComponent';
import styles from './DominoHand.module.css';

interface DominoHandProps {
  dominoes: (Domino | null)[];
  onDominoClick?: (domino: Domino) => void;
  playableDominoes?: Domino[];
  selectedDomino?: Domino;
  faceDown?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  compact?: boolean;
}

export const DominoHand: React.FC<DominoHandProps> = ({
  dominoes,
  onDominoClick,
  playableDominoes = [],
  selectedDomino,
  faceDown = false,
  orientation = 'horizontal',
  className = '',
  compact = false
}) => {
  const isDominoPlayable = (domino: Domino): boolean => {
    return playableDominoes.some(playable => 
      playable.id === domino.id || 
      (playable.high === domino.high && playable.low === domino.low)
    );
  };

  const isDominoSelected = (domino: Domino): boolean => {
    return selectedDomino?.id === domino.id || 
           (selectedDomino?.high === domino.high && selectedDomino?.low === domino.low);
  };

  const getAriaLabel = (): string => {
    const dominoCount = dominoes.filter(d => d !== null).length;
    if (dominoCount === 0) {
      return 'Empty domino hand';
    }
    return `Domino hand with ${dominoCount} dominoes`;
  };

  // Split dominoes into top row (first 4) and bottom row (remaining 3)
  const topRowDominoes = dominoes.slice(0, 4);
  const bottomRowDominoes = dominoes.slice(4, 7);

  const renderDomino = (domino: Domino | null, index: number) => {
    if (domino === null) {
      return (
        <div 
          key={`gap-${index}`} 
          className={`domino-gap ${styles.dominoGap}`}
          aria-hidden="true"
        />
      );
    }

    return (
      <DominoComponent
        key={domino.id}
        domino={domino}
        onClick={() => onDominoClick?.(domino)}
        isPlayable={isDominoPlayable(domino)}
        selected={isDominoSelected(domino)}
        faceDown={faceDown}
        orientation={orientation}
        className={styles.handDomino}
      />
    );
  };

  const classes = [
    'domino-hand',
    'responsive',
    styles.dominoHand,
    styles.responsive,
    compact ? styles.compact : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="group"
      aria-label={getAriaLabel()}
    >
      <div className={`top-row ${styles.topRow}`}>
        {topRowDominoes.map((domino, index) => renderDomino(domino, index))}
      </div>
      <div className={`bottom-row ${styles.bottomRow}`}>
        {bottomRowDominoes.map((domino, index) => renderDomino(domino, index + 4))}
      </div>
    </div>
  );
};
