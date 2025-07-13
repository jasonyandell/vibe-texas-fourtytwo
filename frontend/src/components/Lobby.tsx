import React from 'react';

export const Lobby: React.FC = () => {
  return (
    <div className="lobby texas42-container">
      <h2>Game Lobby</h2>
      <p>Welcome to Texas 42! Join or create a game to start playing.</p>
      
      <div className="lobby-actions">
        <button>Create New Game</button>
        <button>Join Random Game</button>
      </div>
      
      <div className="available-games">
        <h3>Available Games</h3>
        <p>No games available. Create one to get started!</p>
      </div>
    </div>
  );
};
