"use strict";
/**
 * Texas 42 Trump Domino Mapping
 * Logic for determining domino suits and trump relationships
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDominoSuits = getDominoSuits;
exports.isTrumpDomino = isTrumpDomino;
exports.getTrumpRank = getTrumpRank;
exports.getTrumpDominoes = getTrumpDominoes;
const trump_suit_utils_1 = require("./trump-suit-utils");
/**
 * Determine which suits a domino belongs to given the current trump
 * Based on rules-research-4 mapping logic
 *
 * @param domino The domino to map
 * @param trump The current trump suit
 * @returns Array of suits this domino belongs to
 */
function getDominoSuits(domino, trump) {
    if (trump === 'doubles') {
        // In doubles trump, all doubles are trump
        if (domino.high === domino.low)
            return ['doubles'];
        // Non-doubles belong to both number suits they contain
        return [(0, trump_suit_utils_1.getSuitName)(domino.high), (0, trump_suit_utils_1.getSuitName)(domino.low)];
    }
    // Regular trump suit
    if (domino.high === domino.low) {
        // Doubles belong to their number suit when it's trump, otherwise both suits
        if ((0, trump_suit_utils_1.getSuitName)(domino.high) === trump)
            return [trump];
        return [(0, trump_suit_utils_1.getSuitName)(domino.high)];
    }
    // Check if either end is trump
    const suits = [(0, trump_suit_utils_1.getSuitName)(domino.high), (0, trump_suit_utils_1.getSuitName)(domino.low)];
    if (suits.includes(trump))
        return [trump];
    // Non-trump domino: belongs to the higher number suit
    return [(0, trump_suit_utils_1.getSuitName)(domino.high)];
}
/**
 * Check if a domino is trump
 *
 * @param domino The domino to check
 * @param trump The current trump suit
 * @returns True if the domino is trump
 */
function isTrumpDomino(domino, trump) {
    const suits = getDominoSuits(domino, trump);
    return suits.includes(trump);
}
/**
 * Get the trump rank of a domino within its trump suit
 * Higher rank means stronger trump
 *
 * @param domino The domino to rank
 * @param trump The current trump suit
 * @returns Trump rank (higher = stronger) or -1 if not trump
 */
function getTrumpRank(domino, trump) {
    if (!isTrumpDomino(domino, trump))
        return -1;
    if (trump === 'doubles') {
        // In doubles trump, rank by pip total (6-6 highest, 0-0 lowest)
        return domino.high; // Since high === low for doubles
    }
    // For regular trump suits
    if (domino.high === domino.low) {
        // Double is highest in its suit
        return 7; // Higher than any single domino (0-6)
    }
    // For non-double trump, rank by the non-trump end
    const trumpValue = (0, trump_suit_utils_1.getSuitValue)(trump);
    if (domino.high === trumpValue) {
        return domino.low; // Trump is high end, rank by low end
    }
    else {
        return domino.high; // Trump is low end, rank by high end
    }
}
/**
 * Get all trump dominoes from a set
 *
 * @param dominoes Array of dominoes to filter
 * @param trump Current trump suit
 * @returns Array of trump dominoes
 */
function getTrumpDominoes(dominoes, trump) {
    return dominoes.filter(d => isTrumpDomino(d, trump));
}
//# sourceMappingURL=trump-domino-mapping.js.map