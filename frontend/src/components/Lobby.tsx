import React, { useState } from 'react';
import { useLobbyState } from '@/hooks/useLobbyState';
import { Button } from '@/components/ui';
import { LobbyList } from './lobby/LobbyList';
import { CreateGameModal } from './lobby/CreateGameModal';
import { CreateGameButton } from './lobby/CreateGameButton';
import { LobbyControls, type SortOption, type FilterOption } from './lobby/LobbyControls';
import { useCurrentUserId, getCurrentUserName } from '@/utils/userUtils';
import { createGameAndFetchList } from '@/services/gameApi';
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
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  
  const currentUserId = useCurrentUserId();
  const currentUserName = getCurrentUserName();

  // Get filtered and sorted games
  const sortedGames = getSortedGames(sortBy).filter(game =>
    filterStatus === 'all' || game.status === filterStatus
  );

  const handleCreateGame = async (gameName: string) => {
    const newGame = await createGameAndFetchList(gameName, currentUserId, currentUserName);
    
    if (newGame) {
      addGame(newGame);
    }
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

        <LobbyControls
          sortBy={sortBy}
          filterStatus={filterStatus}
          onSortChange={setSortBy}
          onFilterChange={setFilterStatus}
        />

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
