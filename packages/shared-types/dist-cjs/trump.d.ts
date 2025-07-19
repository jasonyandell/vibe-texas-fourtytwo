/**
 * Texas 42 Trump Suit System Types
 * Complete trump suit system with 7 suits and domino mapping logic
 */
import { Domino } from './dominoes';
/**
 * The 7 trump suits in Texas 42
 * Based on rules-research-4: 6 number suits plus doubles
 */
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';
/**
 * Trump system configuration
 * Defines the current trump state and options
 */
export interface TrumpSystem {
    /** The current trump suit */
    suit: DominoSuit;
    /** True if no trump is in effect */
    isNoTrump: boolean;
    /** For no-trump games: whether doubles are high or low */
    doublesOption?: 'high' | 'low';
}
/**
 * Domino suit mapping information
 * Shows which suits a domino belongs to and its trump status
 */
export interface DominoSuitMapping {
    /** The domino being mapped */
    domino: Domino;
    /** All suits this domino belongs to */
    suits: DominoSuit[];
    /** True if this domino is trump */
    isTrump: boolean;
    /** Ranking within trump suit (higher = stronger) */
    trumpRank?: number;
}
/**
 * Trump hierarchy information
 * Defines the ranking system within trump suits
 */
export interface TrumpHierarchy {
    /** The trump suit */
    suit: DominoSuit;
    /** All trump dominoes ranked from highest to lowest */
    rankedDominoes: Domino[];
    /** Total number of trump dominoes */
    trumpCount: number;
}
/**
 * No-trump game configuration
 * Special rules for games without trump
 */
export interface NoTrumpConfig {
    /** Whether doubles are high or low in each suit */
    doublesOption: 'high' | 'low';
    /** Special rules that apply */
    specialRules: string[];
}
/**
 * Convert a domino suit to its numeric value
 * Used for trump determination and comparison
 *
 * @param suit The domino suit
 * @returns Numeric value (0-6) or -1 for doubles
 */
export declare function getSuitValue(suit: DominoSuit): number;
/**
 * Convert a numeric value to its domino suit name
 * Used for mapping domino values to suit names
 *
 * @param value Numeric value (0-6)
 * @returns The corresponding domino suit
 */
export declare function getSuitName(value: number): DominoSuit;
/**
 * Determine which suits a domino belongs to given the current trump
 * Based on rules-research-4 mapping logic
 *
 * @param domino The domino to map
 * @param trump The current trump suit
 * @returns Array of suits this domino belongs to
 */
export declare function getDominoSuits(domino: Domino, trump: DominoSuit): DominoSuit[];
/**
 * Check if a domino is trump
 *
 * @param domino The domino to check
 * @param trump The current trump suit
 * @returns True if the domino is trump
 */
export declare function isTrumpDomino(domino: Domino, trump: DominoSuit): boolean;
/**
 * Get the trump rank of a domino within its trump suit
 * Higher rank means stronger trump
 *
 * @param domino The domino to rank
 * @param trump The current trump suit
 * @returns Trump rank (higher = stronger) or -1 if not trump
 */
export declare function getTrumpRank(domino: Domino, trump: DominoSuit): number;
/**
 * Compare two dominoes for trump hierarchy
 * Returns positive if domino1 is stronger, negative if domino2 is stronger, 0 if equal
 *
 * @param domino1 First domino
 * @param domino2 Second domino
 * @param trump Current trump suit
 * @returns Comparison result
 */
export declare function compareTrumpDominoes(domino1: Domino, domino2: Domino, trump: DominoSuit): number;
/**
 * Compare two non-trump dominoes
 * Used when neither domino is trump
 *
 * @param domino1 First domino
 * @param domino2 Second domino
 * @returns Comparison result
 */
export declare function compareNonTrumpDominoes(domino1: Domino, domino2: Domino): number;
/**
 * Get all trump dominoes from a set
 *
 * @param dominoes Array of dominoes to filter
 * @param trump Current trump suit
 * @returns Array of trump dominoes
 */
export declare function getTrumpDominoes(dominoes: Domino[], trump: DominoSuit): Domino[];
/**
 * Create a trump hierarchy for a given trump suit
 * Returns all trump dominoes ranked from highest to lowest
 *
 * @param trump The trump suit
 * @param allDominoes All available dominoes
 * @returns Trump hierarchy information
 */
export declare function createTrumpHierarchy(trump: DominoSuit, allDominoes: Domino[]): TrumpHierarchy;
/**
 * Validate a trump suit
 *
 * @param suit The suit to validate
 * @returns True if the suit is valid
 */
export declare function isValidTrumpSuit(suit: unknown): suit is DominoSuit;
/**
 * Create a no-trump configuration
 *
 * @param doublesOption Whether doubles are high or low
 * @returns No-trump configuration
 */
export declare function createNoTrumpConfig(doublesOption?: 'high' | 'low'): NoTrumpConfig;
/**
 * Constants for the trump system
 */
export declare const TRUMP_CONSTANTS: {
    /** All valid trump suits */
    readonly ALL_SUITS: readonly ["blanks", "ones", "twos", "threes", "fours", "fives", "sixes", "doubles"];
    /** Number of regular suits (excluding doubles) */
    readonly REGULAR_SUIT_COUNT: 7;
    /** Maximum trump rank for doubles */
    readonly MAX_DOUBLE_RANK: 7;
    /** Number of dominoes in each regular suit */
    readonly DOMINOES_PER_REGULAR_SUIT: 7;
    /** Number of doubles */
    readonly DOUBLES_COUNT: 7;
};
//# sourceMappingURL=trump.d.ts.map