/**
 * Texas 42 Lobby Types
 */
import { PartnershipMarks } from './partnership';
/**
 * Lobby game information
 */
export interface LobbyGame {
    /** Game identifier */
    id: string;
    /** Game name */
    name: string;
    /** Current player count */
    playerCount: number;
    /** Maximum players (always 4 for Texas 42) */
    maxPlayers: number;
    /** Game status */
    status: 'waiting' | 'playing' | 'finished';
    /** Creation timestamp */
    createdAt: string;
    /** Current hand number */
    handNumber?: number;
    /** Current marks if game is active */
    marks?: PartnershipMarks;
}
/**
 * Lobby state
 */
export interface LobbyState {
    /** Available games */
    availableGames: LobbyGame[];
    /** Number of connected players */
    connectedPlayers: number;
}
/**
 * Create empty lobby state
 *
 * @returns Empty lobby state
 */
export declare function createEmptyLobbyState(): LobbyState;
//# sourceMappingURL=lobby.d.ts.map