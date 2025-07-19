/**
 * Texas 42 Game State Types
 * Enhanced game state with complete rule compliance and marks system
 */
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid, SpecialContract } from './bidding';
/**
 * Player positions in Texas 42 partnerships
 * North-South vs East-West partnerships
 */
export type PlayerPosition = 'north' | 'east' | 'south' | 'west';
/**
 * Game phases in Texas 42
 */
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';
/**
 * Partnership teams
 */
export type PartnershipTeam = 'northSouth' | 'eastWest';
/**
 * Player information
 */
export interface Player {
    /** Unique player identifier */
    id: string;
    /** Player display name */
    name: string;
    /** Player position at table */
    position: PlayerPosition;
    /** Current hand of dominoes */
    hand: Domino[];
    /** Connection status */
    isConnected: boolean;
    /** Ready status for game start */
    isReady: boolean;
}
/**
 * Played domino in a trick
 * Enhanced with position and play order information
 */
export interface PlayedDomino {
    /** The domino that was played */
    domino: Domino;
    /** Player who played this domino */
    playerId: string;
    /** Position of the player */
    position: PlayerPosition;
    /** Order in which this domino was played (0-3) */
    playOrder: number;
    /** Timestamp when domino was played */
    timestamp: string;
}
/**
 * Complete trick information
 * Enhanced with scoring and winner determination
 */
export interface Trick {
    /** Unique trick identifier */
    id: string;
    /** All dominoes played in this trick */
    dominoes: PlayedDomino[];
    /** Player who won this trick */
    winner?: string;
    /** Suit that was led */
    leadSuit?: DominoSuit;
    /** Total point value of dominoes in this trick */
    pointValue: number;
    /** Count dominoes captured in this trick */
    countDominoes: Domino[];
    /** Trick number in the hand (1-7) */
    trickNumber: number;
    /** True if trick is complete */
    isComplete: boolean;
}
/**
 * Hand scoring information
 * Tracks points and marks for a completed hand
 */
export interface HandScore {
    /** Hand number */
    handNumber: number;
    /** Points from count dominoes */
    countPoints: number;
    /** Points from tricks won (1 per trick) */
    trickPoints: number;
    /** Total points scored */
    totalPoints: number;
    /** Team that was bidding */
    biddingTeam: PartnershipTeam;
    /** The winning bid for this hand */
    winningBid: Bid;
    /** True if the bid was fulfilled */
    bidFulfilled: boolean;
    /** Marks awarded to bidding team */
    marksAwarded: number;
    /** Marks awarded to opposing team */
    opposingMarksAwarded: number;
    /** Special contract if any */
    specialContract?: SpecialContract;
}
/**
 * Partnership information
 * Enhanced with marks and game scoring
 */
export interface Partnership {
    /** Player IDs in this partnership */
    players: [string, string];
    /** Current hand score */
    currentHandScore: number;
    /** Total marks accumulated */
    marks: number;
    /** Total game score (for point-based games) */
    totalGameScore: number;
    /** Tricks won in current hand */
    tricksWon: number;
    /** True if this partnership is currently bidding */
    isBiddingTeam: boolean;
    /** Active special contract if any */
    specialContractActive?: SpecialContract;
}
/**
 * Partnership state for both teams
 */
export interface PartnershipState {
    /** North-South partnership */
    northSouth: Partnership;
    /** East-West partnership */
    eastWest: Partnership;
}
/**
 * Partnership marks tracking
 */
export interface PartnershipMarks {
    /** North-South marks */
    northSouth: number;
    /** East-West marks */
    eastWest: number;
}
/**
 * Partnership scores (for point-based games)
 */
export interface PartnershipScore {
    /** North-South total score */
    northSouth: number;
    /** East-West total score */
    eastWest: number;
}
/**
 * Bidding state for game management
 * Tracks the current bidding phase progress
 */
export interface BiddingState {
    /** Current player whose turn it is to bid */
    currentBidder?: string;
    /** Current highest bid */
    currentBid?: Bid;
    /** Complete history of all bids in this hand */
    bidHistory: Bid[];
    /** True when bidding phase is complete */
    biddingComplete: boolean;
    /** Number of consecutive passes */
    passCount: number;
    /** Minimum bid amount (always 30 in Texas 42) */
    minimumBid: number;
    /** True if forced bid variation is active */
    forcedBidActive: boolean;
    /** Active special contract if any */
    specialContractActive?: SpecialContract;
}
/**
 * Enhanced scoring state
 * Tracks current hand scoring progress
 */
export interface ScoringState {
    /** Current trick winner */
    currentTrickWinner?: string;
    /** Points from tricks (1 per trick) */
    trickPoints: number;
    /** Count dominoes captured so far */
    countDominoes: Domino[];
    /** Bonus points if any */
    bonusPoints: number;
    /** Penalty points if any */
    penaltyPoints: number;
    /** True if hand scoring is complete */
    roundComplete: boolean;
    /** Calculated hand score */
    handScore?: HandScore;
}
/**
 * Complete game state
 * Enhanced with marks system and rule compliance
 */
export interface GameState {
    /** Unique game identifier */
    id: string;
    /** Current game phase */
    phase: GamePhase;
    /** All players in the game */
    players: Player[];
    /** Partnership information */
    partnerships: PartnershipState;
    /** Current hand number */
    handNumber: number;
    /** Current dealer */
    dealer: string;
    /** Current player (whose turn it is) */
    currentPlayer?: string;
    /** Complete bidding state */
    biddingState: BiddingState;
    /** Current highest bid */
    currentBid?: Bid;
    /** Active special contract */
    specialContract?: SpecialContract;
    /** Current trump suit */
    trump?: DominoSuit;
    /** All completed tricks */
    tricks: Trick[];
    /** Current trick being played */
    currentTrick?: Trick;
    /** Remaining dominoes (boneyard) */
    boneyard: Domino[];
    /** Current hand scoring */
    scoringState: ScoringState;
    /** All completed hand scores */
    handScores: HandScore[];
    /** Current marks for each partnership */
    marks: PartnershipMarks;
    /** Total game scores (for point-based games) */
    gameScore: PartnershipScore;
    /** Marks needed to win (typically 7) */
    marksToWin: number;
    /** True if game is complete */
    gameComplete: boolean;
    /** Winning partnership if game is complete */
    winner?: PartnershipTeam;
    /** Game creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
    /** True if game state is valid */
    isValid: boolean;
    /** Validation errors if any */
    validationErrors: string[];
}
/**
 * Game actions for state management
 */
export type GameAction = {
    type: 'JOIN_GAME';
    playerId: string;
    playerName: string;
    position: PlayerPosition;
} | {
    type: 'LEAVE_GAME';
    playerId: string;
} | {
    type: 'READY_PLAYER';
    playerId: string;
} | {
    type: 'START_GAME';
} | {
    type: 'PLACE_BID';
    playerId: string;
    bid: Bid;
} | {
    type: 'PLAY_DOMINO';
    playerId: string;
    domino: Domino;
} | {
    type: 'COMPLETE_TRICK';
    trickId: string;
} | {
    type: 'COMPLETE_HAND';
    handScore: HandScore;
} | {
    type: 'START_NEW_HAND';
    dealer: string;
} | {
    type: 'END_GAME';
    winner: PartnershipTeam;
} | {
    type: 'RESET_GAME';
};
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
 * Create an empty game state
 *
 * @param gameId Game identifier
 * @returns Empty game state with default values
 */
export declare function createEmptyGameState(gameId: string): GameState;
/**
 * Create empty partnership state
 *
 * @returns Empty partnership state
 */
export declare function createEmptyPartnershipState(): PartnershipState;
/**
 * Create empty scoring state
 *
 * @returns Empty scoring state
 */
export declare function createEmptyScoringState(): ScoringState;
/**
 * Create empty bidding state
 *
 * @returns Empty bidding state
 */
export declare function createEmptyBiddingState(): BiddingState;
/**
 * Create empty lobby state
 *
 * @returns Empty lobby state
 */
export declare function createEmptyLobbyState(): LobbyState;
/**
 * Constants for game state management
 */
export declare const GAME_CONSTANTS: {
    /** Maximum players in a Texas 42 game */
    readonly MAX_PLAYERS: 4;
    /** Number of tricks per hand */
    readonly TRICKS_PER_HAND: 7;
    /** Default marks to win */
    readonly DEFAULT_MARKS_TO_WIN: 7;
    /** Default points to win (for point-based games) */
    readonly DEFAULT_POINTS_TO_WIN: 250;
    /** All player positions */
    readonly PLAYER_POSITIONS: readonly ["north", "east", "south", "west"];
    /** All partnership teams */
    readonly PARTNERSHIP_TEAMS: readonly ["northSouth", "eastWest"];
    /** All game phases */
    readonly GAME_PHASES: readonly ["bidding", "playing", "scoring", "finished"];
};
/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
/**
 * WebSocket message structure
 */
export interface WebSocketMessage {
    type: string;
    gameId?: string;
    playerId?: string;
    data?: unknown;
    timestamp: string;
}
//# sourceMappingURL=game-state.d.ts.map