import React from 'react';
import { useParams } from 'react-router-dom';
import { GameState } from '@texas42/shared-types';
import { useGameState } from '@/hooks/useGameState';
import { useGameBoardBidding } from '@/hooks/useGameBoardBidding';
import { GameBoardHeader } from './GameBoardHeader';
import { GameBoardPlayers } from './GameBoardPlayers';
import { GameBoardCenter } from './GameBoardCenter';
import { GameBoardTrickStacks } from './GameBoardTrickStacks';
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
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId || gameState?.id || 'test-game';

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

  const { handleBid, handlePass } = useGameBoardBidding(gameState, currentPlayerId, updateGameState);

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



  const hasIncompletePlayers = gameState.players.length < 4;

  return (
    <div
      className={`game-board responsive ${styles.gameBoard} ${styles.responsive}`}
      data-testid="game-board"
      role="main"
      aria-label="Texas 42 game board"
    >
      <GameBoardHeader gameId={gameId} gameState={gameState} />

      <div
        className={`baseball-diamond mobile-friendly ${styles.baseballDiamond} ${styles.mobileFriendly}`}
        data-testid="baseball-diamond"
        role="region"
        aria-label="Player areas"
      >
        <GameBoardPlayers
          position="north"
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onDominoPlay={onDominoPlay}
          isSpectatorMode={isSpectatorMode}
        />
        <GameBoardPlayers
          position="east"
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onDominoPlay={onDominoPlay}
          isSpectatorMode={isSpectatorMode}
        />
        <GameBoardPlayers
          position="south"
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onDominoPlay={onDominoPlay}
          isSpectatorMode={isSpectatorMode}
        />
        <GameBoardPlayers
          position="west"
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onDominoPlay={onDominoPlay}
          isSpectatorMode={isSpectatorMode}
        />

        <GameBoardCenter
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          onBid={handleBid}
          onPass={handlePass}
        />
      </div>

      <GameBoardTrickStacks gameState={gameState} />

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
