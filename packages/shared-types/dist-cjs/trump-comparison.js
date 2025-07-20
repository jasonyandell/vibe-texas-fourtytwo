"use strict";
/**
 * Texas 42 Trump Comparison Functions
 * Logic for comparing dominoes and creating trump hierarchies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTrumpDominoes = compareTrumpDominoes;
exports.compareNonTrumpDominoes = compareNonTrumpDominoes;
exports.createTrumpHierarchy = createTrumpHierarchy;
exports.createNoTrumpConfig = createNoTrumpConfig;
const trump_domino_mapping_1 = require("./trump-domino-mapping");
/**
 * Compare two dominoes for trump hierarchy
 * Returns positive if domino1 is stronger, negative if domino2 is stronger, 0 if equal
 *
 * @param domino1 First domino
 * @param domino2 Second domino
 * @param trump Current trump suit
 * @returns Comparison result
 */
function compareTrumpDominoes(domino1, domino2, trump) {
    const rank1 = (0, trump_domino_mapping_1.getTrumpRank)(domino1, trump);
    const rank2 = (0, trump_domino_mapping_1.getTrumpRank)(domino2, trump);
    // If both are trump, compare ranks
    if (rank1 >= 0 && rank2 >= 0) {
        return rank1 - rank2;
    }
    // If only one is trump, trump wins
    if (rank1 >= 0)
        return 1;
    if (rank2 >= 0)
        return -1;
    // Neither is trump, compare by suit and value
    return compareNonTrumpDominoes(domino1, domino2);
}
/**
 * Compare two non-trump dominoes
 * Used when neither domino is trump
 *
 * @param domino1 First domino
 * @param domino2 Second domino
 * @returns Comparison result
 */
function compareNonTrumpDominoes(domino1, domino2) {
    // Compare by higher end first
    if (domino1.high !== domino2.high) {
        return domino1.high - domino2.high;
    }
    // If high ends are equal, compare by lower end
    return domino1.low - domino2.low;
}
/**
 * Create a trump hierarchy for a given trump suit
 * Returns all trump dominoes ranked from highest to lowest
 *
 * @param trump The trump suit
 * @param allDominoes All available dominoes
 * @returns Trump hierarchy information
 */
function createTrumpHierarchy(trump, allDominoes) {
    const trumpDominoes = (0, trump_domino_mapping_1.getTrumpDominoes)(allDominoes, trump);
    // Sort trump dominoes from highest to lowest
    const rankedDominoes = trumpDominoes.sort((a, b) => compareTrumpDominoes(b, a, trump));
    return {
        suit: trump,
        rankedDominoes,
        trumpCount: trumpDominoes.length
    };
}
/**
 * Create a no-trump configuration
 *
 * @param doublesOption Whether doubles are high or low
 * @returns No-trump configuration
 */
function createNoTrumpConfig(doublesOption = 'high') {
    return {
        doublesOption,
        specialRules: [
            'No trump suit in effect',
            `Doubles are ${doublesOption} in each suit`,
            'Follow suit rules still apply',
            'Highest domino of led suit wins'
        ]
    };
}
//# sourceMappingURL=trump-comparison.js.map