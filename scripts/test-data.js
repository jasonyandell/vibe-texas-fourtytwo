/**
 * Test data and expected values for Texas 42 domino validation
 */

const expectedCountDominoes = [
  { high: 5, low: 0, expectedPoints: 5, name: '5-0' },
  { high: 4, low: 1, expectedPoints: 5, name: '4-1' },
  { high: 3, low: 2, expectedPoints: 5, name: '3-2' },
  { high: 6, low: 4, expectedPoints: 10, name: '6-4' },
  { high: 5, low: 5, expectedPoints: 10, name: '5-5' }
];

const sampleNonCountDominoes = [
  { high: 0, low: 0, name: '0-0' },
  { high: 1, low: 0, name: '1-0' },
  { high: 2, low: 0, name: '2-0' },
  { high: 6, low: 6, name: '6-6' },
  { high: 4, low: 4, name: '4-4' },
  { high: 6, low: 3, name: '6-3' },
  { high: 6, low: 2, name: '6-2' },
  { high: 6, low: 1, name: '6-1' }
];

const complianceRules = [
  { rule: '5-0, 4-1, 3-2 dominoes = 5 points each', requiresPass: 3 },
  { rule: '6-4, 5-5 dominoes = 10 points each', requiresPass: 5 },
  { rule: 'All other dominoes = 0 points', requiresAllNonCount: true },
  { rule: 'Total count points = 35', requiresTotal: 35 },
  { rule: 'Total dominoes = 28', requiresDominoes: 28 },
  { rule: 'Exactly 5 count dominoes', requiresCountDominoes: 5 }
];

module.exports = {
  expectedCountDominoes,
  sampleNonCountDominoes,
  complianceRules
};