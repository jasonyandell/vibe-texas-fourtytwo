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
  showPointValue?: boolean;    // Show point value overlay
  highlightCount?: boolean;    // Highlight if count domino
  pointValuePosition?: 'corner' | 'overlay' | 'badge'; // Display style
}

// CSS Modules class name mapping
const valueClassMap: Record<number, string> = {
  0: styles.value0 || '',
  1: styles.value1 || '',
  2: styles.value2 || '',
  3: styles.value3 || '',
  4: styles.value4 || '',
  5: styles.value5 || '',
  6: styles.value6 || ''
};

export const DominoComponent: React.FC<DominoComponentProps> = ({
  domino,
  onClick,
  isPlayable = false,
  className = '',
  faceDown = false,
  orientation = 'horizontal',
  selected = false,
  showPointValue = false,
  highlightCount = false,
  pointValuePosition = 'corner'
}) => {
  const formatPipValue = (value: number): string => {
    return value === 0 ? 'blank' : value.toString();
  };

  const getAriaLabel = (): string => {
    const highLabel = formatPipValue(domino.high);
    const lowLabel = formatPipValue(domino.low);
    const pointInfo = domino.pointValue > 0 ? `, ${domino.pointValue} points` : '';
    return `Domino ${highLabel}-${lowLabel}${pointInfo}`;
  };

  const shouldShowPointValue = (): boolean => {
    return showPointValue && domino.pointValue > 0 && !faceDown;
  };

  const shouldHighlightCount = (): boolean => {
    return highlightCount && domino.isCountDomino && !faceDown;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
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
    shouldHighlightCount() ? 'count-domino' : '',
    shouldHighlightCount() ? styles.countDomino : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-testid={`domino-${domino.high}-${domino.low}`}
      role="button"
      aria-label={getAriaLabel()}
      aria-disabled={!isPlayable}
      tabIndex={isPlayable ? 0 : -1}
    >
      <div className={`domino-half domino-high end ${styles.end} ${valueClassMap[domino.high]}`}>
        {Array.from({ length: domino.high }, (_, i) => (
          <div
            key={i}
            className={`pip pip-${i + 1} ${styles.pip} ${styles[`pip${i + 1}`]}`}
            style={{ opacity: faceDown ? 0 : 1 }}
          />
        ))}
      </div>
      <div className={`domino-divider ${styles.divider}`} />
      <div className={`domino-half domino-low end ${styles.end} ${valueClassMap[domino.low]}`}>
        {Array.from({ length: domino.low }, (_, i) => (
          <div
            key={i}
            className={`pip pip-${i + 1} ${styles.pip} ${styles[`pip${i + 1}`]}`}
            style={{ opacity: faceDown ? 0 : 1 }}
          />
        ))}
      </div>
      {shouldShowPointValue() && (
        <div
          className={`point-value ${styles.pointValue} ${styles[pointValuePosition]} ${domino.pointValue === 5 ? styles.fivePoints : styles.tenPoints}`}
          aria-hidden="true"
        >
          {domino.pointValue}
        </div>
      )}
    </div>
  );
};
