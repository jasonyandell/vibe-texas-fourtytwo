/**
 * Domino utility functions for Texas 42 validation
 */

function calculateDominoPointValue(high, low) {
  const total = high + low;
  if (total === 5) return 5;   // 5-0, 4-1, 3-2
  if (total === 10) return 10; // 6-4, 5-5
  return 0;                    // All other dominoes
}

function createDomino(high, low) {
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

function createFullDominoSet() {
  const dominoes = [];

  // Generate all 28 domino combinations
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low));
    }
  }

  const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);

  return {
    dominoes,
    totalPoints,
    isValid: totalPoints === 35 // Must equal 35 count points
  };
}

module.exports = {
  calculateDominoPointValue,
  createDomino,
  createFullDominoSet
};