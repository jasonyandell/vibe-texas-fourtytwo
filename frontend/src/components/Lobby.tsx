import React, { useState, useMemo } from 'react';
import { useLobbyState } from '@/hooks/useLobbyState';
import { LobbyGame } from '@/types/texas42';
import { Button } from '@/components/ui';
import { LobbyList } from './lobby/LobbyList';
import { CreateGameModal } from './lobby/CreateGameModal';
import { CreateGameButton } from './lobby/CreateGameButton';
import styles from './Lobby.module.css';

export const Lobby: React.FC = () => {
  const {
    lobbyState,
    isLoading,
    error,
    getAvailableGames: _getAvailableGames,
    getJoinableGames,
    getSortedGames,
    addGame,
    clearError
  } = useLobbyState();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'playerCount' | 'name'>('newest');
  const [filterStatus, setFilterStatus] = useState<LobbyGame['status'] | 'all'>('all');
  
  // TODO: Get actual user info from auth context
  const currentUserId = useMemo(() => {
    // In production, this would come from auth context
    // For now, generate a stable ID per session
    const storedId = sessionStorage.getItem('texas42-user-id');
    if (storedId) {
      return storedId;
    }
    const newId = `user-${Date.now()}`;
    sessionStorage.setItem('texas42-user-id', newId);
    return newId;
  }, []);
  const currentUserName = 'Player 1';

  // Get filtered and sorted games
  const sortedGames = getSortedGames(sortBy).filter(game =>
    filterStatus === 'all' || game.status === filterStatus
  );

  const handleCreateGame = async (gameName: string) => {
    const apiUrl = String(import.meta.env.VITE_API_URL ?? 'http://localhost:4201');
    const response = await fetch(`${apiUrl}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: gameName,
        creatorId: currentUserId,
        creatorName: currentUserName
      }),
    });

    const result = await response.json() as { success: boolean; data?: LobbyGame; error?: string };

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create game');
    }

    // Get updated games list
    const gamesResponse = await fetch(`${apiUrl}/api/games`);
    const gamesResult = await gamesResponse.json() as { success: boolean; data?: LobbyGame[] };
    
    if (gamesResult.success && gamesResult.data) {
      // Find the newly created game and add it to the lobby
      const newGame = gamesResult.data.find(g => g.name === gameName);
      if (newGame) {
        addGame(newGame);
      }
    }
    
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

      <div className={styles.welcomeMessage}>
        <p>Welcome to Texas 42!</p>
      </div>

      <div className={styles.lobbyActions}>
        <CreateGameButton
          onClick={() => setShowCreateModal(true)}
          disabled={isLoading}
        />
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

      <div className={styles.gamesSection}>
        <h3>Available Games</h3>

        <div className={styles.lobbyControls}>
          <div className={styles.filterControls}>
            <label htmlFor="status-filter">Filter by status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus((e.target as HTMLSelectElement).value as LobbyGame['status'] | 'all')}
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
              onChange={(e) => setSortBy((e.target as HTMLSelectElement).value as typeof sortBy)}
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
          currentUserId={currentUserId}
          onCreateGame={() => setShowCreateModal(true)}
        />
      </div>

      {showCreateModal && (
        <CreateGameModal
          onCreateGame={handleCreateGame}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
