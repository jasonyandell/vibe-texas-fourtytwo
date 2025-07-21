import React from 'react';
import { GameState, PlayerPosition } from '@texas42/shared-types';
import { DominoComponent } from './DominoComponent';
import styles from './GameBoard.module.css';

interface GameBoardTrickStacksProps {
  gameState: GameState;
}

export const GameBoardTrickStacks: React.FC<GameBoardTrickStacksProps> = ({ gameState }) => {
  const getPartnership = (position: PlayerPosition): 'north-south' | 'east-west' => {
    return position === 'north' || position === 'south' ? 'north-south' : 'east-west';
  };

  const getTeamTricks = (team: 'north-south' | 'east-west') => {
    return gameState.tricks.filter(trick => {
      if (!trick.winner) return false;
      const winnerPlayer = gameState.players.find(p => p.id === trick.winner);
      if (!winnerPlayer) return false;
      const winnerPartnership = getPartnership(winnerPlayer.position);
      return winnerPartnership === team;
    });
  };

  const northSouthTricks = getTeamTricks('north-south');
  const eastWestTricks = getTeamTricks('east-west');

  return (
    <>
      <div
        className={styles.trickStacks}
        data-testid="trick-stacks-north-south"
      >
        <h4>North-South Tricks</h4>
        <div className={styles.trickCount}>Tricks: {northSouthTricks.length}</div>
        <div className={styles.trickStackContainer}>
          {northSouthTricks.map((trick, index) => (
            <div
              key={trick.id}
              className={styles.trickStack}
              data-testid={`trick-stack-${index}`}
            >
              {trick.dominoes.map((play, dominoIndex) => (
                <DominoComponent
                  key={`${trick.id}-${dominoIndex}`}
                  domino={play.domino}
                  orientation="vertical"
                  className={styles.stackedDomino}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={styles.trickStacks}
        data-testid="trick-stacks-east-west"
      >
        <h4>East-West Tricks</h4>
        <div className={styles.trickCount}>Tricks: {eastWestTricks.length}</div>
        <div className={styles.trickStackContainer}>
          {eastWestTricks.map((trick, index) => (
            <div
              key={trick.id}
              className={styles.trickStack}
              data-testid={`trick-stack-${index}`}
            >
              {trick.dominoes.map((play, dominoIndex) => (
                <DominoComponent
                  key={`${trick.id}-${dominoIndex}`}
                  domino={play.domino}
                  orientation="vertical"
                  className={styles.stackedDomino}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};