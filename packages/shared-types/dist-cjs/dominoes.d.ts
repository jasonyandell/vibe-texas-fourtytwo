/**
 * Texas 42 Domino Types and Utilities
 * Enhanced domino types with complete point value system
 */
/**
 * Core domino interface with point values
 * Represents a single domino in the Texas 42 game
 */
export interface Domino {
    /** High value (0-6) */
    high: number;
    /** Low value (0-6) */
    low: number;
    /** Unique identifier */
    id: string;
    /** Point value: 0, 5, or 10 points */
    pointValue: number;
    /** True for scoring dominoes (count dominoes) */
    isCountDomino: boolean;
}
/**
 * Complete domino set with validation
 * Represents the full set of 28 dominoes used in Texas 42
 */
export interface DominoSet {
    /** All 28 dominoes in the set */
    dominoes: Domino[];
    /** Total points from count dominoes (must equal 35) */
    totalPoints: number;
    /** True if the set is valid (has correct dominoes and point total) */
    isValid: boolean;
}
/**
 * Calculate the point value of a domino according to Texas 42 rules
 * Based on rules-research-2: dominoes with 5 or 10 total pips have point values
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns Point value: 0, 5, or 10
 */
export declare function calculateDominoPointValue(high: number, low: number): number;
/**
 * Check if a domino is a count domino (has point value > 0)
 * Count dominoes are the 5 dominoes that contribute to the 35 count points
 *
 * @param domino The domino to check
 * @returns True if the domino has points
 */
export declare function isCountDomino(domino: Domino): boolean;
/**
 * Alternative count domino check using high/low values
 * Useful for validation and factory functions
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns True if the domino has points
 */
export declare function isCountDominoByValues(high: number, low: number): boolean;
/**
 * Create a single domino with point values
 * Factory function that automatically calculates point values and count status
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns A complete domino with point values
 */
export declare function createDomino(high: number, low: number): Domino;
/**
 * Create a full domino set with validation
 * Generates all 28 dominoes in a double-six set with point values
 *
 * @returns Object containing all 28 dominoes and validation info
 */
export declare function createFullDominoSet(): DominoSet;
/**
 * Get all count dominoes from a domino array
 * Filters dominoes to return only those with point values
 *
 * @param dominoes Array of dominoes to filter
 * @returns Array containing only count dominoes
 */
export declare function getCountDominoes(dominoes: Domino[]): Domino[];
/**
 * Calculate total points from a domino array
 * Sums up all point values from the given dominoes
 *
 * @param dominoes Array of dominoes to sum
 * @returns Total point value
 */
export declare function calculateTotalPoints(dominoes: Domino[]): number;
/**
 * Validate a domino object
 * Checks if a domino has valid structure and values
 *
 * @param value Object to validate
 * @returns True if the object is a valid domino
 */
export declare function isValidDomino(value: unknown): value is Domino;
/**
 * Validate a domino set
 * Checks if a domino set is complete and valid for Texas 42
 *
 * @param dominoSet The domino set to validate
 * @returns True if the set is valid
 */
export declare function isValidDominoSet(dominoSet: DominoSet): boolean;
/**
 * Constants for Texas 42 domino point system
 */
export declare const DOMINO_CONSTANTS: {
    /** Total number of dominoes in a double-six set */
    readonly TOTAL_DOMINOES: 28;
    /** Total points available from count dominoes */
    readonly TOTAL_COUNT_POINTS: 35;
    /** Number of count dominoes */
    readonly COUNT_DOMINO_COUNT: 5;
    /** Valid point values for dominoes */
    readonly VALID_POINT_VALUES: readonly [0, 5, 10];
    /** Maximum domino value (double-six) */
    readonly MAX_DOMINO_VALUE: 6;
    /** Minimum domino value */
    readonly MIN_DOMINO_VALUE: 0;
};
//# sourceMappingURL=dominoes.d.ts.map