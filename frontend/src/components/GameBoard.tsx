import React from 'react';
import { useParams } from 'react-router-dom';

export const GameBoard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  
  return (
    <div className="game-board texas42-container">
      <div className="domino-table">
        <h2>Texas 42 Game Board</h2>
        <p>Game ID: {gameId}</p>
        
        {/* Player areas will be positioned around the table */}
        <div className="player-area player-north">
          <span>North Player</span>
        </div>
        
        <div className="player-area player-east">
          <span>East Player</span>
        </div>
        
        <div className="player-area player-south">
          <span>South Player (You)</span>
        </div>
        
        <div className="player-area player-west">
          <span>West Player</span>
        </div>
        
        {/* Center area for played dominoes */}
        <div className="center-play-area">
          <p>Dominoes will be played here</p>
        </div>
      </div>
      
      <div className="game-controls">
        <div className="score-display">
          <span>North-South: 0</span>
          <span>East-West: 0</span>
        </div>
      </div>
    </div>
  );
};
