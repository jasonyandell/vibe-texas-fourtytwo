import { GameState, Domino, Trick, PlayedDomino, Bid, BiddingState } from '@texas42/shared-types';

// Mock dominoes for demo purposes
export const mockDominoes = {
  sixSix: { high: 6, low: 6 } as Domino,
  sixFive: { high: 6, low: 5 } as Domino,
  sixFour: { high: 6, low: 4 } as Domino,
  sixThree: { high: 6, low: 3 } as Domino,
  sixTwo: { high: 6, low: 2 } as Domino,
  sixOne: { high: 6, low: 1 } as Domino,
  sixBlank: { high: 6, low: 0 } as Domino,
  fiveFive: { high: 5, low: 5 } as Domino,
  fiveFour: { high: 5, low: 4 } as Domino,
  fiveThree: { high: 5, low: 3 } as Domino,
  fiveTwo: { high: 5, low: 2 } as Domino,
  fiveOne: { high: 5, low: 1 } as Domino,
  fiveBlank: { high: 5, low: 0 } as Domino,
  fourFour: { high: 4, low: 4 } as Domino,
  fourThree: { high: 4, low: 3 } as Domino,
  fourTwo: { high: 4, low: 2 } as Domino,
  fourOne: { high: 4, low: 1 } as Domino,
  fourBlank: { high: 4, low: 0 } as Domino,
  threeThree: { high: 3, low: 3 } as Domino,
  threeTwo: { high: 3, low: 2 } as Domino,
  threeOne: { high: 3, low: 1 } as Domino,
  threeBlank: { high: 3, low: 0 } as Domino,
  twoTwo: { high: 2, low: 2 } as Domino,
  twoOne: { high: 2, low: 1 } as Domino,
  twoBlank: { high: 2, low: 0 } as Domino,
  oneOne: { high: 1, low: 1 } as Domino,
  oneBlank: { high: 1, low: 0 } as Domino,
  blankBlank: { high: 0, low: 0 } as Domino
};

// Mock played dominoes for tricks
export const createMockPlayedDomino = (
  player: 'north' | 'east' | 'south' | 'west',
  domino: Domino,
  order: number = 1
): PlayedDomino => ({
  player,
  domino,
  order,
  timestamp: new Date().toISOString()
});

// Mock trick for demo board showcase
export const createMockTrick = (): Trick => ({
  id: 'demo-trick-1',
  playedDominoes: [
    createMockPlayedDomino('north', mockDominoes.sixFive, 1),
    createMockPlayedDomino('east', mockDominoes.fiveThree, 2),
    createMockPlayedDomino('south', mockDominoes.sixTwo, 3),
    createMockPlayedDomino('west', mockDominoes.fourOne, 4)
  ],
  winner: 'north',
  points: 5,
  trickNumber: 1,
  trump: 6,
  leadPlayer: 'north',
  completed: true
});

// Mock bidding state for demo
export const createMockBiddingState = (): BiddingState => {
  const winningBid: Bid = {
    player: 'north',
    amount: 32,
    trump: 6,
    timestamp: new Date().toISOString()
  };

  return {
    bidHistory: [
      { player: 'north', amount: 30, trump: 6, timestamp: new Date().toISOString() },
      { player: 'east', amount: 31, trump: 5, timestamp: new Date().toISOString() },
      winningBid
    ],
    currentBid: winningBid,
    biddingComplete: true,
    passCount: 3,
    minimumBid: 30,
    forcedBidActive: false
  };
};

// Mock tricks for partnership stacks
export const createMockTricks = (): Trick[] => [
  {
    id: 'trick-1',
    playedDominoes: [
      createMockPlayedDomino('north', mockDominoes.sixSix, 1),
      createMockPlayedDomino('east', mockDominoes.fiveFive, 2),
      createMockPlayedDomino('south', mockDominoes.sixFour, 3),
      createMockPlayedDomino('west', mockDominoes.threeTwo, 4)
    ],
    winner: 'north',
    points: 10,
    trickNumber: 1,
    trump: 6,
    leadPlayer: 'north',
    completed: true
  },
  {
    id: 'trick-2',
    playedDominoes: [
      createMockPlayedDomino('east', mockDominoes.fiveBlank, 1),
      createMockPlayedDomino('south', mockDominoes.fourThree, 2),
      createMockPlayedDomino('west', mockDominoes.twoOne, 3),
      createMockPlayedDomino('north', mockDominoes.sixThree, 4)
    ],
    winner: 'south',
    points: 5,
    trickNumber: 2,
    trump: 6,
    leadPlayer: 'east',
    completed: true
  },
  {
    id: 'trick-3',
    playedDominoes: [
      createMockPlayedDomino('south', mockDominoes.fourFour, 1),
      createMockPlayedDomino('west', mockDominoes.threeOne, 2),
      createMockPlayedDomino('north', mockDominoes.sixOne, 3),
      createMockPlayedDomino('east', mockDominoes.twoBlank, 4)
    ],
    winner: 'north',
    points: 0,
    trickNumber: 3,
    trump: 6,
    leadPlayer: 'south',
    completed: true
  },
  {
    id: 'trick-4',
    playedDominoes: [
      createMockPlayedDomino('west', mockDominoes.oneOne, 1),
      createMockPlayedDomino('north', mockDominoes.fiveFour, 2),
      createMockPlayedDomino('east', mockDominoes.threeBlank, 3),
      createMockPlayedDomino('south', mockDominoes.twoTwo, 4)
    ],
    winner: 'east',
    points: 0,
    trickNumber: 4,
    trump: 6,
    leadPlayer: 'west',
    completed: true
  },
  {
    id: 'trick-5',
    playedDominoes: [
      createMockPlayedDomino('north', mockDominoes.oneBlank, 1),
      createMockPlayedDomino('east', mockDominoes.blankBlank, 2),
      createMockPlayedDomino('south', mockDominoes.fiveTwo, 3),
      createMockPlayedDomino('west', mockDominoes.fourTwo, 4)
    ],
    winner: 'east',
    points: 5,
    trickNumber: 5,
    trump: 6,
    leadPlayer: 'north',
    completed: true
  }
];

// Demo game state for board showcase
export const createDemoBoardGameState = (): GameState => {
  const tricks = createMockTricks();
  const biddingState = createMockBiddingState();

  return {
    id: 'demo-board-game',
    phase: 'playing',
    players: [
      { id: 'demo-north', name: 'North', position: 'north', hand: [], isConnected: true, isReady: true },
      { id: 'demo-east', name: 'East', position: 'east', hand: [], isConnected: true, isReady: true },
      { id: 'demo-south', name: 'South', position: 'south', hand: [], isConnected: true, isReady: true },
      { id: 'demo-west', name: 'West', position: 'west', hand: [], isConnected: true, isReady: true }
    ],
    currentPlayer: 'demo-north',
    biddingState,
    partnerships: {
      northSouth: {
        players: ['demo-north', 'demo-south'],
        currentHandScore: 15,
        marks: 2,
        totalGameScore: 2,
        tricksWon: 3,
        isBiddingTeam: true
      },
      eastWest: {
        players: ['demo-east', 'demo-west'],
        currentHandScore: 8,
        marks: 1,
        totalGameScore: 1,
        tricksWon: 2,
        isBiddingTeam: false
      }
    },
    handNumber: 3,
    tricks,
    boneyard: [],
    scoringState: {
      trickPoints: 20,
      countDominoes: [mockDominoes.fiveBlank, mockDominoes.fourOne],
      bonusPoints: 0,
      penaltyPoints: 0,
      roundComplete: false
    },
    handScores: [
      { northSouth: 42, eastWest: 0 },
      { northSouth: 31, eastWest: 11 }
    ],
    marks: { northSouth: 2, eastWest: 1 },
    gameScore: { northSouth: 2, eastWest: 1 },
    marksToWin: 7,
    gameComplete: false,
    dealer: 'demo-south',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isValid: true,
    validationErrors: []
  };
};

// Demo game state for dominoes showcase
export const createDemoDominoesGameState = (): GameState => {
  const baseState = createDemoBoardGameState();
  
  return {
    ...baseState,
    id: 'demo-dominoes-game',
    phase: 'dealing',
    players: baseState.players.map(player => ({
      ...player,
      hand: [
        mockDominoes.sixSix,
        mockDominoes.sixFive,
        mockDominoes.fiveFour,
        mockDominoes.fourThree,
        mockDominoes.threeTwo,
        mockDominoes.twoOne,
        mockDominoes.oneBlank
      ]
    }))
  };
};

// Demo game state for players showcase
export const createDemoPlayersGameState = (): GameState => {
  const baseState = createDemoBoardGameState();
  
  return {
    ...baseState,
    id: 'demo-players-game',
    phase: 'bidding',
    biddingState: {
      bidHistory: [
        { player: 'demo-north', amount: 30, trump: 6, timestamp: new Date().toISOString() }
      ],
      currentBid: { player: 'demo-north', amount: 30, trump: 6, timestamp: new Date().toISOString() },
      biddingComplete: false,
      passCount: 0,
      minimumBid: 31,
      forcedBidActive: false
    },
    currentPlayer: 'demo-east'
  };
};

// Helper function to get mock data based on demo type
export const getDemoMockData = (demoType: string): GameState => {
  switch (demoType) {
    case 'board':
      return createDemoBoardGameState();
    case 'dominoes':
      return createDemoDominoesGameState();
    case 'players':
      return createDemoPlayersGameState();
    default:
      return createDemoBoardGameState();
  }
};