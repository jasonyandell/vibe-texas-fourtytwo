import React from 'react';
import { useParams } from 'react-router-dom';
import { GameState, PlayerPosition } from '@/types/texas42';
import { DominoHand } from './DominoHand';
import { DominoComponent } from './DominoComponent';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  gameState?: GameState;
  currentPlayerId?: string;
  onDominoPlay?: (dominoId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayerId,
  onDominoPlay
}) => {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameState) {
    return (
      <div className={`game-board ${styles.gameBoard} ${styles.loading}`} data-testid="game-board">
        <div className={styles.loadingMessage}>
          <h2>Loading Game...</h2>
          <p>Game ID: {gameId}</p>
        </div>
      </div>
    );
  }

  const getPlayerByPosition = (position: PlayerPosition) => {
    return gameState.players.find(player => player.position === position);
  };

  const getCurrentPlayer = () => {
    return gameState.players.find(player => player.id === gameState.currentPlayer);
  };

  const isCurrentPlayer = (playerId: string) => {
    return gameState.currentPlayer === playerId;
  };

  const isDealer = (playerId: string) => {
    return gameState.dealer === playerId;
  };

  const getPlayerAreaClasses = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position);
    if (!player) return `player-area player-${position} ${styles.playerArea} ${styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`]}`;

    return [
      'player-area',
      `player-${position}`,
      styles.playerArea,
      styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`],
      isCurrentPlayer(player.id) ? 'current-player' : '',
      isCurrentPlayer(player.id) ? styles.currentPlayer : '',
      isDealer(player.id) ? 'dealer' : '',
      isDealer(player.id) ? styles.dealer : ''
    ].filter(Boolean).join(' ');
  };

  const formatPhase = (phase: string) => {
    return phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase';
  };

  const formatTrumpSuit = (trump?: string) => {
    if (!trump) return '';
    return `Trump: ${trump.charAt(0).toUpperCase() + trump.slice(1)}`;
  };

  const renderPlayerArea = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position);

    if (!player) {
      return (
        <div
          key={position}
          className={getPlayerAreaClasses(position)}
          data-testid={`player-area-${position}`}
        >
          <div className={styles.playerInfo}>
            <span className={styles.playerName}>Waiting for player...</span>
          </div>
        </div>
      );
    }

    const isCurrentUser = player.id === currentPlayerId;
    const showHand = isCurrentUser || gameState.phase === 'finished';

    return (
      <div
        key={position}
        className={getPlayerAreaClasses(position)}
        data-testid={`player-area-${position}`}
      >
        <div className={styles.playerInfo}>
          <span className={styles.playerName}>{player.name}</span>
          {isDealer(player.id) && <span className={styles.dealerBadge}>Dealer</span>}
          {isCurrentPlayer(player.id) && <span className={styles.currentPlayerBadge}>Current Turn</span>}
        </div>

        {player.hand.length > 0 && (
          <DominoHand
            dominoes={player.hand}
            faceDown={!showHand}
            onDominoClick={isCurrentUser ? (domino) => onDominoPlay?.(domino.id) : undefined}
            className={styles.playerHand}
          />
        )}
      </div>
    );
  };

  const renderCenterArea = () => {
    return (
      <div
        className={`center-play-area ${styles.centerPlayArea}`}
        data-testid="center-play-area"
        role="region"
        aria-label="Center play area"
      >
        {gameState.currentTrick && gameState.currentTrick.dominoes.length > 0 ? (
          <div className={styles.currentTrick} data-testid="current-trick">
            <h3>Current Trick</h3>
            <div className={styles.trickDominoes}>
              {gameState.currentTrick.dominoes.map((play, index) => (
                <div key={index} className={styles.playedDomino}>
                  <DominoComponent domino={play.domino} />
                  <span className={styles.playerLabel}>
                    {getPlayerByPosition(play.position)?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyTrick}>
            <p>Waiting for play...</p>
            {getCurrentPlayer() && (
              <p className={styles.turnIndicator}>
                Current turn: {getCurrentPlayer()?.name}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const hasIncompletePlayers = gameState.players.length < 4;

  return (
    <div
      className={`game-board responsive ${styles.gameBoard} ${styles.responsive}`}
      data-testid="game-board"
      role="main"
      aria-label="Texas 42 game board"
    >
      <div className={styles.gameHeader}>
        <div className={styles.gameInfo}>
          <h2>Texas 42</h2>
          <p>Game ID: {gameId}</p>
          <span className={styles.gamePhase}>{formatPhase(gameState.phase)}</span>
          {gameState.trump && (
            <span className={styles.trumpSuit}>{formatTrumpSuit(gameState.trump)}</span>
          )}
        </div>

        <div className={styles.scoreDisplay}>
          <div className={styles.scoreTeam}>
            <span className={styles.teamName}>North-South</span>
            <span className={styles.teamScore}>{gameState.scores.northSouth}</span>
            <span className={styles.gameScore}>({gameState.gameScore.northSouth})</span>
          </div>
          <div className={styles.scoreTeam}>
            <span className={styles.teamName}>East-West</span>
            <span className={styles.teamScore}>{gameState.scores.eastWest}</span>
            <span className={styles.gameScore}>({gameState.gameScore.eastWest})</span>
          </div>
        </div>
      </div>

      <div
        className={`baseball-diamond mobile-friendly ${styles.baseballDiamond} ${styles.mobileFriendly}`}
        data-testid="baseball-diamond"
        role="region"
        aria-label="Player areas"
      >
        {renderPlayerArea('north')}
        {renderPlayerArea('east')}
        {renderPlayerArea('south')}
        {renderPlayerArea('west')}

        {renderCenterArea()}
      </div>

      {hasIncompletePlayers && (
        <div className={styles.waitingMessage}>
          <p>Waiting for players to join... ({gameState.players.length}/4)</p>
        </div>
      )}

      <div className={styles.gameControls}>
        <div className={styles.actionButtons}>
          {/* Future: Add game action buttons here */}
        </div>
      </div>
    </div>
  );
};
