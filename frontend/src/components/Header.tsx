import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="game-header flex-between">
      <h1>Texas 42</h1>
      <div className="header-controls">
        <span>Authentic Domino Game</span>
      </div>
    </header>
  );
};
