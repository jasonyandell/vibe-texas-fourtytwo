import React, { useState } from 'react';
import { useLobbyState } from '@/hooks/useLobbyState';
import { LobbyGame } from '@/types/texas42';
import { Button } from '@/components/ui';
import { LobbyList } from './lobby/LobbyList';
import { CreateGameModal } from './lobby/CreateGameModal';
import styles from './Lobby.module.css';

export const Lobby: React.FC = () => {
  const {
    lobbyState,
    isLoading,
    error,
    getAvailableGames,
    getJoinableGames,
    getSortedGames,
    addGame,
    clearError
  } = useLobbyState();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'playerCount' | 'name'>('newest');
  const [filterStatus, setFilterStatus] = useState<LobbyGame['status'] | 'all'>('all');

  // Get filtered and sorted games
  const sortedGames = getSortedGames(sortBy).filter(game =>
    filterStatus === 'all' || game.status === filterStatus
  );

  const handleCreateGame = (gameName: string) => {
    const newGame: LobbyGame = {
      id: `game-${Date.now()}`,
      name: gameName,
      playerCount: 0,
      maxPlayers: 4,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    addGame(newGame);
    setShowCreateModal(false);
  };

  const handleJoinRandomGame = () => {
    const joinableGames = getJoinableGames();
    if (joinableGames.length > 0) {
      // TODO: Implement actual join logic
      console.log('Joining random game:', joinableGames[0]);
    }
  };

  return (
    <div className={`${styles.lobby} texas42-container`}>
      <div className={styles.lobbyHeader}>
        <h2>Texas 42 Lobby</h2>
        <div className={styles.connectedPlayers}>
          {lobbyState.connectedPlayers} players online
        </div>
      </div>

      <div className={styles.lobbyActions}>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          disabled={isLoading}
        >
          Create New Game
        </Button>
        <Button
          variant="secondary"
          onClick={handleJoinRandomGame}
          disabled={isLoading || getJoinableGames().length === 0}
        >
          Join Random Game
        </Button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error.message}</p>
          <Button variant="ghost" size="small" onClick={clearError}>
            Dismiss
          </Button>
        </div>
      )}

      <div className={styles.lobbyControls}>
        <div className={styles.filterControls}>
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LobbyGame['status'] | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">All Games</option>
            <option value="waiting">Waiting for Players</option>
            <option value="playing">In Progress</option>
            <option value="finished">Completed</option>
          </select>
        </div>

        <div className={styles.sortControls}>
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="playerCount">Player Count</option>
            <option value="name">Game Name</option>
          </select>
        </div>
      </div>

      <LobbyList
        games={sortedGames}
        loading={isLoading}
        error={error}
      />

      {showCreateModal && (
        <CreateGameModal
          onCreateGame={handleCreateGame}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
