import React from 'react';
import { useParams } from 'react-router-dom';
import {
  LegacyGameState as GameState,
  PlayerPosition,
  DominoSuit,
  createCompatibleBid,
  createCompatibleBiddingState
} from '@texas42/shared-types';
import { DominoHand } from './DominoHand';
import { DominoComponent } from './DominoComponent';
import { BiddingPanel } from './BiddingPanel';
import { BiddingHistory } from './BiddingHistory';
import { useGameState } from '@/hooks/useGameState';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  gameState?: GameState;
  currentPlayerId?: string;
  onDominoPlay?: (dominoId: string) => void;
  isSpectatorMode?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayerId,
  onDominoPlay,
  isSpectatorMode = false
}) => {
  const { gameId } = useParams<{ gameId: string }>();

  // Try to get the game state context, but don't fail if it's not available (for tests)
  let updateGameState: ((gameState: GameState) => void) | undefined;
  try {
    const gameStateContext = useGameState();
    updateGameState = gameStateContext.updateGameState;
  } catch (error) {
    // Context not available (likely in tests), use a no-op function
    console.warn('GameState context not available:', error instanceof Error ? error.message : String(error));
    updateGameState = () => {
      console.warn('GameState context not available, bid handling disabled');
    };
  }

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

  const getPartnership = (position: PlayerPosition): 'north-south' | 'east-west' => {
    return position === 'north' || position === 'south' ? 'north-south' : 'east-west';
  };

  const isCurrentBidder = (playerId: string) => {
    return gameState.phase === 'bidding' && gameState.currentPlayer === playerId;
  };

  // Bid handling functions
  const handleBid = (amount: number, trump: DominoSuit) => {
    if (!gameState || !currentPlayerId || !updateGameState) {
      console.error('Cannot place bid: missing game state, player ID, or update function');
      return;
    }

    try {
      // Create the bid object using compatibility helper
      const bid = createCompatibleBid(currentPlayerId, amount, trump);

      // Update the game state with the new bid using compatibility helper
      const updatedBiddingState = createCompatibleBiddingState({
        currentBid: bid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), bid],
        currentBidder: getNextBidder(currentPlayerId),
        minimumBid: amount + 1,
        biddingComplete: false,
        passCount: gameState.biddingState?.passCount || 0
      });

      // Check if bidding should end (this is a simplified check)
      const passCount = gameState.biddingState?.passCount || 0;
      if (passCount >= 3) {
        updatedBiddingState.biddingComplete = true;
      }

      const updatedGameState = {
        ...gameState,
        currentBid: bid,
        trump: trump,
        biddingState: updatedBiddingState,
        currentPlayer: updatedBiddingState.biddingComplete ? gameState.dealer : updatedBiddingState.currentBidder,
        phase: updatedBiddingState.biddingComplete ? 'playing' as const : 'bidding' as const,
        updatedAt: new Date().toISOString()
      };

      updateGameState(updatedGameState);
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };

  const handlePass = () => {
    if (!gameState || !currentPlayerId || !updateGameState) {
      console.error('Cannot pass: missing game state, player ID, or update function');
      return;
    }

    try {
      // Create a pass bid (amount = 0) using compatibility helper
      const passBid = createCompatibleBid(currentPlayerId, 0, 'blanks');

      const newPassCount = (gameState.biddingState?.passCount || 0) + 1;
      const biddingComplete = newPassCount >= 3 && !gameState.currentBid;

      const updatedBiddingState = createCompatibleBiddingState({
        currentBid: gameState.biddingState?.currentBid,
        bidHistory: [...(gameState.biddingState?.bidHistory || []), passBid],
        currentBidder: getNextBidder(currentPlayerId),
        passCount: newPassCount,
        biddingComplete,
        minimumBid: gameState.biddingState?.minimumBid || 30
      });

      const updatedGameState = {
        ...gameState,
        biddingState: updatedBiddingState,
        currentPlayer: biddingComplete ? gameState.dealer : updatedBiddingState.currentBidder,
        phase: biddingComplete ? 'playing' as const : 'bidding' as const,
        updatedAt: new Date().toISOString()
      };

      updateGameState(updatedGameState);
    } catch (error) {
      console.error('Failed to pass:', error);
    }
  };

  // Helper function to get the next bidder
  const getNextBidder = (currentBidderId: string): string => {
    const playerPositions: PlayerPosition[] = ['north', 'east', 'south', 'west'];
    const currentPlayer = gameState.players.find(p => p.id === currentBidderId);
    if (!currentPlayer) return gameState.players[0]?.id || '';

    const currentIndex = playerPositions.indexOf(currentPlayer.position);
    const nextIndex = (currentIndex + 1) % 4;
    const nextPosition = playerPositions[nextIndex];

    const nextPlayer = gameState.players.find(p => p.position === nextPosition);
    return nextPlayer?.id || '';
  };

  const getPlayerAreaClasses = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position);
    const partnership = getPartnership(position);
    const partnershipClass = partnership === 'north-south' ? 'partnershipNorthSouth' : 'partnershipEastWest';

    if (!player) return `player-area player-${position} ${styles.playerArea} ${styles[`player${position.charAt(0).toUpperCase() + position.slice(1)}`]} ${styles[partnershipClass]}`;

    return [
      'player-area',
      `player-${position}`,
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

  const formatPhase = (phase: string) => {
    return phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase';
  };

  const formatTrumpSuit = (trump?: string) => {
    if (!trump) return '';
    return `Trump: ${trump.charAt(0).toUpperCase() + trump.slice(1)}`;
  };

  const formatBid = (bid?: { amount: number; trump?: string }) => {
    if (!bid || bid.amount === 0) return '';
    return `Bid: ${bid.amount}`;
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

  const renderPlayerArea = (position: PlayerPosition) => {
    const player = getPlayerByPosition(position);
    const partnership = getPartnership(position);

    if (!player) {
      return (
        <div
          key={position}
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
        key={position}
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
          />
        )}
      </div>
    );
  };

  const renderTrickStacks = () => {
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

  const renderCenterArea = () => {
    return (
      <div
        className={`center-play-area ${styles.centerPlayArea}`}
        data-testid="center-play-area"
        role="region"
        aria-label="Center play area"
      >
        {gameState.phase === 'bidding' ? (
          <div className={styles.biddingArea} data-testid="bidding-area">
            <div className={styles.biddingContainer}>
              <BiddingPanel
                currentBid={gameState.currentBid || null}
                currentBidder={gameState.currentPlayer || ''}
                isCurrentPlayer={gameState.currentPlayer === currentPlayerId}
                minimumBid={gameState.biddingState?.minimumBid || 30}
                onBid={handleBid}
                onPass={handlePass}
                className={styles.centerBiddingPanel}
              />
              <BiddingHistory
                bidHistory={gameState.biddingState?.bidHistory || []}
                players={gameState.players}
                className={styles.biddingHistoryPanel}
              />
            </div>
          </div>
        ) : gameState.currentTrick && gameState.currentTrick.dominoes.length > 0 ? (
          <div className={styles.currentTrick} data-testid="current-trick">
            <h3>Current Trick</h3>
            <div className={styles.trickDominoes}>
              {gameState.currentTrick.dominoes.map((play) => (
                <div key={`${play.playerId}-${play.domino.id}`} className={styles.playedDomino}>
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
          {gameState.currentBid && (
            <span className={styles.bidDisplay}>{formatBid(gameState.currentBid)}</span>
          )}
          {gameState.trump && (
            <span className={styles.trumpSuit}>{formatTrumpSuit(gameState.trump)}</span>
          )}
        </div>

        <div className={styles.scoreDisplay}>
          <div className={styles.scoreTeam}>
            <span className={styles.teamName}>North-South</span>
            <span className={styles.teamScore}>{gameState.scores.northSouth}</span>
            <span className={styles.gameScore}>Games: {gameState.gameScore.northSouth}</span>
          </div>
          <div className={styles.scoreTeam}>
            <span className={styles.teamName}>East-West</span>
            <span className={styles.teamScore}>{gameState.scores.eastWest}</span>
            <span className={styles.gameScore}>Games: {gameState.gameScore.eastWest}</span>
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

      {renderTrickStacks()}

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
