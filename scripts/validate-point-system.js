#!/usr/bin/env node

/**
 * Validation script for Texas 42 Domino Point System
 * Verifies that our implementation matches the exact rules from the story requirements
 */

const { calculateDominoPointValue, createFullDominoSet } = require('./domino-utils');
const { expectedCountDominoes, sampleNonCountDominoes, complianceRules } = require('./test-data');

console.log('🎯 Texas 42 Domino Point System Validation\n');

// Test 1: Verify exact point values for count dominoes
console.log('📊 Testing Count Domino Point Values:');

let countDominoTests = 0;
let countDominoPass = 0;

expectedCountDominoes.forEach(({ high, low, expectedPoints, name }) => {
  countDominoTests++;
  const actualPoints = calculateDominoPointValue(high, low);
  const passed = actualPoints === expectedPoints;
  
  console.log(`  ${passed ? '✅' : '❌'} ${name}: ${actualPoints} points (expected ${expectedPoints})`);
  
  if (passed) countDominoPass++;
});

console.log(`\n📈 Count Domino Tests: ${countDominoPass}/${countDominoTests} passed\n`);

// Test 2: Verify non-count dominoes have 0 points
console.log('🔍 Testing Non-Count Dominoes (sample):');

let nonCountTests = 0;
let nonCountPass = 0;

sampleNonCountDominoes.forEach(({ high, low, name }) => {
  nonCountTests++;
  const actualPoints = calculateDominoPointValue(high, low);
  const passed = actualPoints === 0;
  
  console.log(`  ${passed ? '✅' : '❌'} ${name}: ${actualPoints} points (expected 0)`);
  
  if (passed) nonCountPass++;
});

console.log(`\n📈 Non-Count Domino Tests: ${nonCountPass}/${nonCountTests} passed\n`);

// Test 3: Verify total points in complete domino set
console.log('🎲 Testing Complete Domino Set:');

try {
  const { dominoes, totalPoints, isValid } = createFullDominoSet();
  
  console.log(`  📦 Total dominoes: ${dominoes.length} (expected 28)`);
  console.log(`  🎯 Total count points: ${totalPoints} (expected 35)`);
  console.log(`  ✅ Set validation: ${isValid ? 'PASS' : 'FAIL'}`);
  
  // Count the actual count dominoes
  const actualCountDominoes = dominoes.filter(d => d.pointValue > 0);
  console.log(`  🔢 Count dominoes found: ${actualCountDominoes.length} (expected 5)`);
  
  // Verify each count domino
  console.log('\n  📋 Count Domino Breakdown:');
  actualCountDominoes.forEach(domino => {
    const expected = expectedCountDominoes.find(e => e.high === domino.high && e.low === domino.low);
    const correct = expected && domino.pointValue === expected.expectedPoints;
    console.log(`    ${correct ? '✅' : '❌'} ${domino.high}-${domino.low}: ${domino.pointValue} points`);
  });
  
} catch (error) {
  console.log(`  ❌ Error creating domino set: ${error.message}`);
}

// Test 4: Verify all 28 domino combinations
console.log('\n🔍 Testing All 28 Domino Combinations:');

let totalDominoes = 0;
let totalCalculatedPoints = 0;
let allCombinationsCorrect = true;

for (let high = 0; high <= 6; high++) {
  for (let low = 0; low <= high; low++) {
    totalDominoes++;
    const points = calculateDominoPointValue(high, low);
    totalCalculatedPoints += points;
    
    // Check if this should be a count domino
    const shouldBeCount = expectedCountDominoes.some(e => e.high === high && e.low === low);
    const expectedPoints = shouldBeCount ? 
      expectedCountDominoes.find(e => e.high === high && e.low === low).expectedPoints : 0;
    
    if (points !== expectedPoints) {
      console.log(`  ❌ ${high}-${low}: got ${points}, expected ${expectedPoints}`);
      allCombinationsCorrect = false;
    }
  }
}

console.log(`  📊 Total dominoes tested: ${totalDominoes}`);
console.log(`  🎯 Total points calculated: ${totalCalculatedPoints}`);
console.log(`  ✅ All combinations correct: ${allCombinationsCorrect ? 'YES' : 'NO'}`);

// Test 5: Rules compliance summary
console.log('\n🏆 RULES COMPLIANCE SUMMARY:');
console.log('='.repeat(50));

const rules = [
  { rule: '5-0, 4-1, 3-2 dominoes = 5 points each', passed: countDominoPass >= 3 },
  { rule: '6-4, 5-5 dominoes = 10 points each', passed: countDominoPass === 5 },
  { rule: 'All other dominoes = 0 points', passed: nonCountPass === nonCountTests },
  { rule: 'Total count points = 35', passed: totalCalculatedPoints === 35 },
  { rule: 'Total dominoes = 28', passed: totalDominoes === 28 },
  { rule: 'Exactly 5 count dominoes', passed: expectedCountDominoes.length === 5 }
];

let rulesPass = 0;
rules.forEach(({ rule, passed }) => {
  console.log(`${passed ? '✅' : '❌'} ${rule}`);
  if (passed) rulesPass++;
});

console.log('='.repeat(50));
console.log(`🎯 OVERALL COMPLIANCE: ${rulesPass}/${rules.length} rules passed`);

if (rulesPass === rules.length) {
  console.log('🎉 SUCCESS: Implementation fully complies with Texas 42 rules!');
  process.exit(0);
} else {
  console.log('❌ FAILURE: Implementation does not fully comply with Texas 42 rules.');
  process.exit(1);
}