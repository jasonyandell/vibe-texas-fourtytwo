/**
 * Test configuration and constants for E2E tests
 */

export const TEST_CONFIG = {
  // Timeouts
  TIMEOUT: {
    DEFAULT: 30000,
    ELEMENT_WAIT: 10000,
    NAVIGATION: 15000,
    API_RESPONSE: 5000,
    ANIMATION: 1000
  },

  // URLs
  URLS: {
    HOME: '/',
    DEMO_BASE: '/demo',
    DEMO_BOARD: '/demo/board',
    DEMO_DOMINOES: '/demo/dominoes',
    DEMO_PLAYERS: '/demo/players',
    DEMO_BIDDING: '/demo/bidding',
    DEMO_FLOW: '/demo/flow'
  },

  // Test data selectors (commonly used across tests)
  SELECTORS: {
    // Demo page selectors
    DEMO_SHOWCASE: '[data-testid="demo-showcase"]',
    DEMO_NAVIGATION: '[data-testid="demo-navigation"]',
    
    // Navigation selectors
    NAV_DOMINOES: '[data-testid="nav-dominoes"]',
    NAV_PLAYERS: '[data-testid="nav-players"]',
    NAV_BIDDING: '[data-testid="nav-bidding"]',
    NAV_BOARD: '[data-testid="nav-board"]',
    NAV_FLOW: '[data-testid="nav-flow"]',

    // Game board selectors
    GAME_BOARD_CONTAINER: '[data-testid="game-board-section-container"]',
    CENTER_PLAY_AREA: '[data-testid="demo-center-play-area"]',
    TRICK_STACK_NS: '[data-testid="demo-trick-stack-north-south"]',
    TRICK_STACK_EW: '[data-testid="demo-trick-stack-east-west"]',
    SCORES_DISPLAY: '[data-testid="demo-scores-display"]',
    GAME_STATUS: '[data-testid="demo-game-status"]',

    // Played dominoes
    PLAYED_DOMINO_NORTH: '[data-testid="played-domino-north"]',
    PLAYED_DOMINO_EAST: '[data-testid="played-domino-east"]',
    PLAYED_DOMINO_SOUTH: '[data-testid="played-domino-south"]',
    PLAYED_DOMINO_WEST: '[data-testid="played-domino-west"]',

    // Trick stack items
    TRICK_STACK_ITEM_NS: (index: number) => `[data-testid="trick-stack-item-ns-${index}"]`,
    TRICK_STACK_ITEM_EW: (index: number) => `[data-testid="trick-stack-item-ew-${index}"]`,

    // Lobby selectors
    LOBBY_EMPTY_STATE: '[data-testid="lobby-empty-state"]',
    GAME_CARD: '[data-testid="game-card"]',
    GAME_CODE: '[data-testid="game-code"]',
    CREATE_GAME_BUTTON: 'button:has-text("Create Game")',
    
    // Modal selectors
    MODAL: '[role="dialog"]',
    GAME_NAME_INPUT: 'input#game-name',
    SUBMIT_BUTTON: 'button[type="submit"]',
    CANCEL_BUTTON: 'button:has-text("Cancel")',
    ERROR_MESSAGE: '[role="alert"]'
  },

  // Expected text content
  TEXT: {
    DEMO_TITLE: 'Texas 42 Demo Showcase',
    CENTER_PLAY_AREA: 'Center Play Area',
    TRICK_STACKS: 'Trick Stacks',
    SCORE_STATUS: 'Score & Game Status',
    GAME_STATE_EXAMPLES: 'Game State Examples',
    NORTH_SOUTH_PARTNERSHIP: 'North-South Partnership',
    EAST_WEST_PARTNERSHIP: 'East-West Partnership',
    OPENING_TRICK: 'Opening Trick',
    CURRENT_HAND_SCORES: 'Current Hand Scores',
    PLAYING_PHASE: 'Playing Phase',
    WAITING_FOR_PLAYERS: 'Waiting for players',
    GAME_NAME_REQUIRED: 'Game name is required',
    GAME_NAME_TOO_SHORT: 'Game name must be at least 3 characters',
    GAME_NAME_TOO_LONG: 'Game name must be less than 50 characters',
    FAILED_TO_CREATE_GAME: 'Failed to create game',
    DUPLICATE_GAME_NAME: 'A game with this name already exists'
  },

  // Test game data
  GAME_DATA: {
    VALID_NAMES: [
      'Test Game',
      'My Custom Game',
      'Demo Game 123',
      'Players Wanted',
      'Texas 42 Fun'
    ],
    INVALID_NAMES: {
      TOO_SHORT: 'ab',
      TOO_LONG: 'a'.repeat(51),
      EMPTY: ''
    },
    DEFAULT_SCORES: {
      NS_TRICKS: 3,
      NS_POINTS: 15,
      EW_TRICKS: 2,
      EW_POINTS: 8,
      NS_GAMES: 2,
      EW_GAMES: 1
    },
    DEFAULT_BID: {
      AMOUNT: 32,
      TRUMP: 'Sixes (6s)',
      PLAYER: 'North'
    }
  },

  // Player positions
  POSITIONS: ['north', 'east', 'south', 'west'] as const,

  // Game phases
  PHASES: ['dealing', 'bidding', 'playing', 'scoring', 'complete'] as const,

  // Trump suits
  TRUMP_SUITS: [
    { value: 0, name: 'Blanks (0s)' },
    { value: 1, name: 'Ones (1s)' },
    { value: 2, name: 'Twos (2s)' },
    { value: 3, name: 'Threes (3s)' },
    { value: 4, name: 'Fours (4s)' },
    { value: 5, name: 'Fives (5s)' },
    { value: 6, name: 'Sixes (6s)' }
  ]
};

/**
 * Helper function to get selector with timeout
 */
export const getSelector = (selector: string, timeout: number = TEST_CONFIG.TIMEOUT.ELEMENT_WAIT) => ({
  selector,
  timeout
});

/**
 * Helper function to create game card selector for specific game name
 */
export const getGameCardSelector = (gameName: string) => 
  `${TEST_CONFIG.SELECTORS.GAME_CARD}:has-text("${gameName}")`;

/**
 * Helper function to create navigation selector for specific section
 */
export const getNavSelector = (section: string) => 
  `[data-testid="nav-${section}"]`;

/**
 * Common test utilities
 */
export const testUtils = {
  generateGameName: () => `Test Game ${Date.now()}`,
  generateGameCode: () => Math.random().toString(36).substring(2, 8).toUpperCase(),
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
};