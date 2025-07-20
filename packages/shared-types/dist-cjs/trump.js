"use strict";
/**
 * Texas 42 Trump Suit System Types
 * Complete trump suit system with 7 suits and domino mapping logic
 * Re-exports all trump-related functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Re-export all functionality from the split modules
var trump_suit_utils_1 = require("./trump-suit-utils");
Object.defineProperty(exports, "getSuitValue", { enumerable: true, get: function () { return trump_suit_utils_1.getSuitValue; } });
Object.defineProperty(exports, "getSuitName", { enumerable: true, get: function () { return trump_suit_utils_1.getSuitName; } });
Object.defineProperty(exports, "isValidTrumpSuit", { enumerable: true, get: function () { return trump_suit_utils_1.isValidTrumpSuit; } });
Object.defineProperty(exports, "TRUMP_CONSTANTS", { enumerable: true, get: function () { return trump_suit_utils_1.TRUMP_CONSTANTS; } });
var trump_domino_mapping_1 = require("./trump-domino-mapping");
Object.defineProperty(exports, "getDominoSuits", { enumerable: true, get: function () { return trump_domino_mapping_1.getDominoSuits; } });
Object.defineProperty(exports, "isTrumpDomino", { enumerable: true, get: function () { return trump_domino_mapping_1.isTrumpDomino; } });
Object.defineProperty(exports, "getTrumpRank", { enumerable: true, get: function () { return trump_domino_mapping_1.getTrumpRank; } });
Object.defineProperty(exports, "getTrumpDominoes", { enumerable: true, get: function () { return trump_domino_mapping_1.getTrumpDominoes; } });
var trump_comparison_1 = require("./trump-comparison");
Object.defineProperty(exports, "compareTrumpDominoes", { enumerable: true, get: function () { return trump_comparison_1.compareTrumpDominoes; } });
Object.defineProperty(exports, "compareNonTrumpDominoes", { enumerable: true, get: function () { return trump_comparison_1.compareNonTrumpDominoes; } });
Object.defineProperty(exports, "createTrumpHierarchy", { enumerable: true, get: function () { return trump_comparison_1.createTrumpHierarchy; } });
Object.defineProperty(exports, "createNoTrumpConfig", { enumerable: true, get: function () { return trump_comparison_1.createNoTrumpConfig; } });
//# sourceMappingURL=trump.js.map