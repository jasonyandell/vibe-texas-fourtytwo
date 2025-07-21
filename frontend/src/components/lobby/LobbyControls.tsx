import React from 'react';
import { LobbyGame } from '@/types/texas42';
import styles from '../Lobby.module.css';

export type SortOption = 'newest' | 'oldest' | 'playerCount' | 'name';
export type FilterOption = LobbyGame['status'] | 'all';

interface LobbyControlsProps {
  sortBy: SortOption;
  filterStatus: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

export const LobbyControls: React.FC<LobbyControlsProps> = ({
  sortBy,
  filterStatus,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <div className={styles.lobbyControls}>
      <div className={styles.filterControls}>
        <label htmlFor="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
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
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={styles.sortSelect}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="playerCount">Player Count</option>
          <option value="name">Game Name</option>
        </select>
      </div>
    </div>
  );
};