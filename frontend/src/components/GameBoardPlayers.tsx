import React from 'react';
import { GameState, PlayerPosition } from '@texas42/shared-types';
import { DominoHand } from './DominoHand';
import styles from './GameBoard.module.css';

interface GameBoardPlayersProps {
  position: PlayerPosition;
  gameState: GameState;
  currentPlayerId?: string;
  onDominoPlay?: (dominoId: string) => void;
  isSpectatorMode?: boolean;
}

export const GameBoardPlayers: React.FC<GameBoardPlayersProps> = ({
  position,
  gameState,
  currentPlayerId,
  onDominoPlay,
  isSpectatorMode = false
}) => {
  const getPlayerByPosition = (position: PlayerPosition) => {
    return gameState.players.find(player => player.position === position);
  };

  const isCurrentPlayer = (playerId: string) => {
    return gameState.currentPlayer === playerId;
  };

  const isDealer = (playerId: string) => {
    return gameState.dealer === playerId;
  };

  const getPartnership = (position: PlayerPosition): 'north-south' | 'east-west' => {
    return position === 'north' || position === 'south' ? 'north-south' : 'east-west';
  };

  const isCurrentBidder = (playerId: string) => {
    return gameState.phase === 'bidding' && gameState.currentPlayer === playerId;
  };

  const getPlayerAreaClasses = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position);
    const partnership = getPartnership(position);
    const partnershipClass = partnership === 'north-south' ? 'partnershipNorthSouth' : 'partnershipEastWest';

    if (!player) return `player-area player-${position} flex-center ${styles.playerArea} ${styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`]} ${styles[partnershipClass]}`;

    return [
      'player-area',
      `player-${position}`,
      'flex-center',
      styles.playerArea,
      styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`],
      styles[partnershipClass],
      isCurrentPlayer(player.id) ? 'current-player' : '',
      isCurrentPlayer(player.id) ? styles.currentPlayer : '',
      isCurrentBidder(player.id) ? 'current-bidder' : '',
      isCurrentBidder(player.id) ? styles.currentBidder : '',
      isDealer(player.id) ? 'dealer' : '',
      isDealer(player.id) ? styles.dealer : ''
    ].filter(Boolean).join(' ');
  };

  const player = getPlayerByPosition(position);
  const partnership = getPartnership(position);

  if (!player) {
    return (
      <div
        className={getPlayerAreaClasses(position)}
        data-testid={`player-area-${position}`}
        data-partnership={partnership}
      >
        <div className={styles.playerInfo}>
          <span className={styles.playerName}>Waiting for player...</span>
        </div>
      </div>
    );
  }

  const isCurrentUser = player.id === currentPlayerId;
  const showHand = isCurrentUser || gameState.phase === 'finished' || isSpectatorMode;

  return (
    <div
      className={getPlayerAreaClasses(position)}
      data-testid={`player-area-${position}`}
      data-partnership={partnership}
    >
      <div className={styles.playerInfo}>
        <span className={styles.playerName}>{player.name}</span>
        {isDealer(player.id) && <span className={styles.dealerBadge}>Dealer</span>}
        {gameState.phase === 'bidding' && isCurrentBidder(player.id) && (
          <span className={styles.currentBidderBadge}>Bidding</span>
        )}
        {gameState.phase !== 'bidding' && isCurrentPlayer(player.id) && (
          <span className={styles.currentPlayerBadge}>Current Turn</span>
        )}
      </div>

      {player.hand.length > 0 && (
        <DominoHand
          dominoes={player.hand}
          faceDown={!showHand}
          onDominoClick={isCurrentUser ? (domino) => onDominoPlay?.(domino.id) : undefined}
          className={styles.playerHand}
          compact={true}
        />
      )}
    </div>
  );
};