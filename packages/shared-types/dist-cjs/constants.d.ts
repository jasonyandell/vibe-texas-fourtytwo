/**
 * Texas 42 Game Constants
 */
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
//# sourceMappingURL=constants.d.ts.map