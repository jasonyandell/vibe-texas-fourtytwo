import React from 'react';
import styles from './ScoreDisplay.module.css';

export interface ScoreDisplayProps {
  scores: {
    northSouth: number;
    eastWest: number;
  };
  maxScore?: number;
  showProgress?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scores,
  maxScore = 7,
  showProgress = true
}) => {
  const { northSouth, eastWest } = scores;
  const isGameComplete = northSouth >= maxScore || eastWest >= maxScore;
  const leader = northSouth > eastWest ? 'North-South' : eastWest > northSouth ? 'East-West' : 'Tied';

  return (
    <div className={styles.scoreDisplay}>
      <div className={styles.scoreHeader}>
        <h4>Current Score</h4>
        {!isGameComplete && leader !== 'Tied' && (
          <span className={styles.leader}>
            {leader} leads
          </span>
        )}
        {isGameComplete && (
          <span className={styles.winner}>
            {leader} wins!
          </span>
        )}
      </div>

      <div className={styles.scoreGrid}>
        <div className={`${styles.teamScore} ${styles.northSouth}`}>
          <div className={styles.teamLabel}>North-South</div>
          <div className={styles.scoreValue}>
            {northSouth}
            <span className={styles.maxScore}>/{maxScore}</span>
          </div>
          {showProgress && (
            <div className={styles.scoreProgress}>
              <div 
                className={styles.progressBar}
                style={{ width: `${(northSouth / maxScore) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className={styles.scoreDivider}>
          <span>vs</span>
        </div>

        <div className={`${styles.teamScore} ${styles.eastWest}`}>
          <div className={styles.teamLabel}>East-West</div>
          <div className={styles.scoreValue}>
            {eastWest}
            <span className={styles.maxScore}>/{maxScore}</span>
          </div>
          {showProgress && (
            <div className={styles.scoreProgress}>
              <div 
                className={styles.progressBar}
                style={{ width: `${(eastWest / maxScore) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {isGameComplete && (
        <div className={styles.gameComplete}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
          Game Complete
        </div>
      )}
    </div>
  );
};
