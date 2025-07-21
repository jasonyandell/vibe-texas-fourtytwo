/**
 * Texas 42 Trump Logic Functions
 * Re-exports from modularized trump logic files
 */

// Trump suit mapping functions
export { 
  getDominoSuits, 
  isTrumpDomino, 
  getTrumpDominoes 
} from './trump-suit-mapping';

// Trump ranking functions
export { 
  getTrumpRank, 
  compareTrumpDominoes, 
  compareNonTrumpDominoes 
} from './trump-ranking';

// Trump hierarchy functions
export { 
  createTrumpHierarchy, 
  createNoTrumpConfig 
} from './trump-hierarchy';