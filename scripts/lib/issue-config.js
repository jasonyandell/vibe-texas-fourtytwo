// Project mapping
const PROJECT_MAPPING = {
  'rules': 3, // Texas 42 Rules Research
  'e2e-tests': 2, // E2E Test Fixes  
  'story': 1, // Texas 42 Development Board
  'core-features': 1 // Also goes to main board
};

// Issue categorization based on title patterns
const ISSUE_CATEGORIES = {
  'rules-research': { labels: ['story', 'rules'], project: 3 },
  'fix-e2e': { labels: ['story', 'e2e-tests'], project: 2 },
  'initial-features': { labels: ['story', 'core-features'], project: 1 },
  'github-migration': { labels: ['story'], project: 1 },
  'domino-point-system': { labels: ['story'], project: 1 },
  'default-story': { labels: ['story'], project: 1 }
};

module.exports = {
  PROJECT_MAPPING,
  ISSUE_CATEGORIES
};