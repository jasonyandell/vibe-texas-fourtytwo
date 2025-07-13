import React from 'react';
import { Domino } from '@/types/texas42';
import styles from './DominoComponent.module.css';

interface DominoComponentProps {
  domino: Domino;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  faceDown?: boolean;
  orientation?: 'horizontal' | 'vertical';
  selected?: boolean;
}

export const DominoComponent: React.FC<DominoComponentProps> = ({
  domino,
  onClick,
  isPlayable = false,
  className = '',
  faceDown = false,
  orientation = 'horizontal',
  selected = false
}) => {
  const formatPipValue = (value: number): string => {
    return value === 0 ? 'blank' : value.toString();
  };

  const getAriaLabel = (): string => {
    const highLabel = formatPipValue(domino.high);
    const lowLabel = formatPipValue(domino.low);
    return `Domino ${highLabel}-${lowLabel}`;
  };

  const classes = [
    'domino',
    styles.domino,
    faceDown ? 'face-down' : 'face-up',
    faceDown ? styles.faceDown : styles.faceUp,
    orientation,
    styles[orientation],
    isPlayable ? 'playable' : '',
    isPlayable ? styles.playable : '',
    selected ? 'selected' : '',
    selected ? styles.selected : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      data-testid={`domino-${domino.high}-${domino.low}`}
      role="button"
      aria-label={getAriaLabel()}
      aria-disabled={!isPlayable}
      tabIndex={isPlayable ? 0 : -1}
    >
      <div className={`domino-half domino-high ${styles.dominoHalf} ${styles.dominoHigh} ${styles[`pips${domino.high}`]}`}>
        {Array.from({ length: domino.high }, (_, i) => (
          <div
            key={i}
            className={`pip pip-${i + 1} ${styles.pip} ${styles[`pip${i + 1}`]}`}
            style={{ opacity: faceDown ? 0 : 1 }}
          />
        ))}
      </div>
      <div className={`domino-divider ${styles.dominoDivider}`} />
      <div className={`domino-half domino-low ${styles.dominoHalf} ${styles.dominoLow} ${styles[`pips${domino.low}`]}`}>
        {Array.from({ length: domino.low }, (_, i) => (
          <div
            key={i}
            className={`pip pip-${i + 1} ${styles.pip} ${styles[`pip${i + 1}`]}`}
            style={{ opacity: faceDown ? 0 : 1 }}
          />
        ))}
      </div>
    </div>
  );
};
