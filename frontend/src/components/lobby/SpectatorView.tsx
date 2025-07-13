import React, { useState } from 'react';
import { GameState, Player } from '@/types/texas42';
import { Button, Badge, Card } from '@/components/ui';
import { DominoHand } from '@/components/DominoHand';
import { GameBoard } from '@/components/GameBoard';
import styles from './SpectatorView.module.css';

export interface SpectatorInfo {
  id: string;
  name: string;
  joinedAt: string;
}

export interface SpectatorViewProps {
  gameState: GameState;
  spectators: SpectatorInfo[];
  currentSpectatorId?: string;
  onLeaveSpectating?: () => void;
  onJoinAsPlayer?: () => void;
  showSpectatorList?: boolean;
}

export const SpectatorView: React.FC<SpectatorViewProps> = ({
  gameState,
  spectators,
  currentSpectatorId,
  onLeaveSpectating,
  onJoinAsPlayer,
  showSpectatorList = true
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAllHands, setShowAllHands] = useState(true);

  const currentSpectator = spectators.find(s => s.id === currentSpectatorId);
  const canJoinAsPlayer = gameState.players.length < 4;

  const getPlayerByPosition = (position: string) => {
    return gameState.players.find(p => p.position === position);
  };

  const renderPlayerHand = (player: Player, position: string) => {
    const isSelected = selectedPlayer === player.id;
    
    return (
      <div 
        key={player.id}
        className={`${styles.playerHandContainer} ${styles[position]} ${isSelected ? styles.selected : ''}`}
        onClick={() => setSelectedPlayer(isSelected ? null : player.id)}
      >
        <div className={styles.playerInfo}>
          <h4>{player.name}</h4>
          <Badge variant={player.isConnected ? 'success' : 'danger'} size="small">
            {player.isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        
        <DominoHand
          dominoes={player.hand}
          faceUp={true} // Always show face-up for spectators
          playable={false}
          gaps={[]}
          className={styles.spectatorHand}
        />
        
        <div className={styles.handStats}>
          <span>{player.hand.length} dominoes</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.spectatorView}>
      <div className={styles.spectatorHeader}>
        <div className={styles.headerInfo}>
          <h2>Spectating: {gameState.id}</h2>
          <div className={styles.gamePhase}>
            <Badge variant="primary">
              Phase: {gameState.phase}
            </Badge>
            {gameState.currentPlayer && (
              <Badge variant="secondary">
                Current: {gameState.players.find(p => p.id === gameState.currentPlayer)?.name}
              </Badge>
            )}
          </div>
        </div>

        <div className={styles.spectatorActions}>
          {canJoinAsPlayer && onJoinAsPlayer && (
            <Button variant="primary" onClick={onJoinAsPlayer}>
              Join as Player
            </Button>
          )}
          {onLeaveSpectating && (
            <Button variant="secondary" onClick={onLeaveSpectating}>
              Stop Spectating
            </Button>
          )}
        </div>
      </div>

      <div className={styles.viewControls}>
        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={showAllHands}
              onChange={(e) => setShowAllHands(e.target.checked)}
            />
            Show All Hands
          </label>
        </div>

        <div className={styles.playerSelector}>
          <label htmlFor="player-select">Focus on Player:</label>
          <select
            id="player-select"
            value={selectedPlayer || ''}
            onChange={(e) => setSelectedPlayer(e.target.value || null)}
          >
            <option value="">All Players</option>
            {gameState.players.map(player => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.position})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.gameContent}>
        {gameState.phase === 'playing' && (
          <div className={styles.gameBoard}>
            <GameBoard
              gameState={gameState}
              currentPlayerId={selectedPlayer || ''}
              onDominoPlay={() => {}} // Spectators can't play
              spectatorMode={true}
            />
          </div>
        )}

        {showAllHands && (
          <div className={styles.allHands}>
            <h3>Player Hands</h3>
            <div className={styles.handsGrid}>
              {gameState.players.map(player => 
                renderPlayerHand(player, player.position)
              )}
            </div>
          </div>
        )}

        {selectedPlayer && (
          <div className={styles.focusedPlayer}>
            <h3>Focused Player</h3>
            {(() => {
              const player = gameState.players.find(p => p.id === selectedPlayer);
              return player ? renderPlayerHand(player, player.position) : null;
            })()}
          </div>
        )}
      </div>

      {showSpectatorList && (
        <Card className={styles.spectatorList}>
          <div className={styles.spectatorListHeader}>
            <h4>Spectators ({spectators.length})</h4>
          </div>
          
          <div className={styles.spectatorItems}>
            {spectators.length === 0 ? (
              <p className={styles.noSpectators}>No other spectators</p>
            ) : (
              spectators.map(spectator => (
                <div 
                  key={spectator.id} 
                  className={`${styles.spectatorItem} ${spectator.id === currentSpectatorId ? styles.currentSpectator : ''}`}
                >
                  <span className={styles.spectatorName}>
                    {spectator.name}
                    {spectator.id === currentSpectatorId && (
                      <Badge variant="primary" size="small">You</Badge>
                    )}
                  </span>
                  <span className={styles.joinTime}>
                    Joined {new Date(spectator.joinedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
