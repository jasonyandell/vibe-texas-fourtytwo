"use strict";
/**
 * Texas 42 Domino Types and Utilities
 * Enhanced domino types with complete point value system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMINO_CONSTANTS = void 0;
exports.calculateDominoPointValue = calculateDominoPointValue;
exports.isCountDomino = isCountDomino;
exports.isCountDominoByValues = isCountDominoByValues;
exports.createDomino = createDomino;
exports.createFullDominoSet = createFullDominoSet;
exports.getCountDominoes = getCountDominoes;
exports.calculateTotalPoints = calculateTotalPoints;
exports.isValidDomino = isValidDomino;
exports.isValidDominoSet = isValidDominoSet;
/**
 * Calculate the point value of a domino according to Texas 42 rules
 * Based on rules-research-2: dominoes with 5 or 10 total pips have point values
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns Point value: 0, 5, or 10
 */
function calculateDominoPointValue(high, low) {
    const total = high + low;
    if (total === 5)
        return 5; // 5-0, 4-1, 3-2
    if (total === 10)
        return 10; // 6-4, 5-5
    return 0; // All other dominoes
}
/**
 * Check if a domino is a count domino (has point value > 0)
 * Count dominoes are the 5 dominoes that contribute to the 35 count points
 *
 * @param domino The domino to check
 * @returns True if the domino has points
 */
function isCountDomino(domino) {
    return domino.pointValue > 0;
}
/**
 * Alternative count domino check using high/low values
 * Useful for validation and factory functions
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns True if the domino has points
 */
function isCountDominoByValues(high, low) {
    return calculateDominoPointValue(high, low) > 0;
}
/**
 * Create a single domino with point values
 * Factory function that automatically calculates point values and count status
 *
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns A complete domino with point values
 */
function createDomino(high, low) {
    // Validate input ranges
    if (high < 0 || high > 6 || low < 0 || low > 6) {
        throw new Error(`Invalid domino values: high=${high}, low=${low}. Values must be 0-6.`);
    }
    // Ensure high >= low (domino convention)
    if (low > high) {
        [high, low] = [low, high];
    }
    const pointValue = calculateDominoPointValue(high, low);
    const isCountDomino = pointValue > 0;
    return {
        high,
        low,
        id: `${high}-${low}`,
        pointValue,
        isCountDomino
    };
}
/**
 * Create a full domino set with validation
 * Generates all 28 dominoes in a double-six set with point values
 *
 * @returns Object containing all 28 dominoes and validation info
 */
function createFullDominoSet() {
    const dominoes = [];
    // Generate all 28 domino combinations (double-six set)
    for (let high = 0; high <= 6; high++) {
        for (let low = 0; low <= high; low++) {
            dominoes.push(createDomino(high, low));
        }
    }
    const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);
    const isValid = totalPoints === 35 && dominoes.length === 28;
    return {
        dominoes,
        totalPoints,
        isValid
    };
}
/**
 * Get all count dominoes from a domino array
 * Filters dominoes to return only those with point values
 *
 * @param dominoes Array of dominoes to filter
 * @returns Array containing only count dominoes
 */
function getCountDominoes(dominoes) {
    return dominoes.filter(d => d.isCountDomino);
}
/**
 * Calculate total points from a domino array
 * Sums up all point values from the given dominoes
 *
 * @param dominoes Array of dominoes to sum
 * @returns Total point value
 */
function calculateTotalPoints(dominoes) {
    return dominoes.reduce((sum, d) => sum + d.pointValue, 0);
}
/**
 * Validate a domino object
 * Checks if a domino has valid structure and values
 *
 * @param value Object to validate
 * @returns True if the object is a valid domino
 */
function isValidDomino(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    const { id, high, low, pointValue, isCountDomino } = obj;
    // Check required fields
    if (typeof id !== 'string' || id.length === 0)
        return false;
    if (typeof high !== 'number' || typeof low !== 'number')
        return false;
    if (typeof pointValue !== 'number' || typeof isCountDomino !== 'boolean')
        return false;
    // Check value ranges (0-6 for double-six dominoes)
    if (high < 0 || high > 6 || low < 0 || low > 6)
        return false;
    // Check domino convention: high >= low
    if (low > high)
        return false;
    // Check point value is valid (0, 5, or 10)
    if (![0, 5, 10].includes(pointValue))
        return false;
    // Check consistency between pointValue and isCountDomino
    if ((pointValue > 0) !== isCountDomino)
        return false;
    // Verify point value calculation is correct
    const expectedPointValue = calculateDominoPointValue(high, low);
    if (pointValue !== expectedPointValue)
        return false;
    return true;
}
/**
 * Validate a domino set
 * Checks if a domino set is complete and valid for Texas 42
 *
 * @param dominoSet The domino set to validate
 * @returns True if the set is valid
 */
function isValidDominoSet(dominoSet) {
    const { dominoes, totalPoints, isValid } = dominoSet;
    // Check basic structure
    if (!Array.isArray(dominoes) || typeof totalPoints !== 'number' || typeof isValid !== 'boolean') {
        return false;
    }
    // Must have exactly 28 dominoes
    if (dominoes.length !== 28)
        return false;
    // All dominoes must be valid
    if (!dominoes.every(isValidDomino))
        return false;
    // Must have exactly 35 count points
    const calculatedPoints = calculateTotalPoints(dominoes);
    if (calculatedPoints !== 35 || totalPoints !== 35)
        return false;
    // Check for duplicate dominoes
    const ids = new Set(dominoes.map(d => d.id));
    if (ids.size !== 28)
        return false;
    // Verify we have all expected dominoes
    const expectedDominoes = createFullDominoSet();
    const expectedIds = new Set(expectedDominoes.dominoes.map(d => d.id));
    for (const id of ids) {
        if (!expectedIds.has(id))
            return false;
    }
    return isValid;
}
/**
 * Constants for Texas 42 domino point system
 */
exports.DOMINO_CONSTANTS = {
    /** Total number of dominoes in a double-six set */
    TOTAL_DOMINOES: 28,
    /** Total points available from count dominoes */
    TOTAL_COUNT_POINTS: 35,
    /** Number of count dominoes */
    COUNT_DOMINO_COUNT: 5,
    /** Valid point values for dominoes */
    VALID_POINT_VALUES: [0, 5, 10],
    /** Maximum domino value (double-six) */
    MAX_DOMINO_VALUE: 6,
    /** Minimum domino value */
    MIN_DOMINO_VALUE: 0
};
//# sourceMappingURL=dominoes.js.map