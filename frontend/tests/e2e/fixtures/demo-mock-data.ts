import { GameState, Domino, Trick, PlayedDomino, Bid, BiddingState, DominoSuit } from '@texas42/shared-types';

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
  playerId: string,
  position: 'north' | 'east' | 'south' | 'west',
  domino: Domino,
  playOrder: number = 1
): PlayedDomino => ({
  playerId,
  position,
  domino,
  playOrder,
  timestamp: new Date().toISOString()
});

// Mock trick for demo board showcase
export const createMockTrick = (): Trick => ({
  id: 'demo-trick-1',
  dominoes: [
    createMockPlayedDomino('player-north', 'north', mockDominoes.sixFive, 0),
    createMockPlayedDomino('player-east', 'east', mockDominoes.fiveThree, 1),
    createMockPlayedDomino('player-south', 'south', mockDominoes.sixTwo, 2),
    createMockPlayedDomino('player-west', 'west', mockDominoes.fourOne, 3)
  ],
  winner: 'player-north',
  pointValue: 5,
  countDominoes: [],
  trickNumber: 1,
  isComplete: true
});

// Mock bidding state for demo
export const createMockBiddingState = (): BiddingState => {
  const winningBid: Bid = {
    playerId: 'north',
    amount: 32,
    trump: 6 as DominoSuit,
    isSpecialContract: false,
    timestamp: new Date().toISOString()
  };

  return {
    bidHistory: [
      { playerId: 'north', amount: 30, trump: 6 as DominoSuit, isSpecialContract: false, timestamp: new Date().toISOString() },
      { playerId: 'east', amount: 31, trump: 5 as DominoSuit, isSpecialContract: false, timestamp: new Date().toISOString() },
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
    dominoes: [
      createMockPlayedDomino('player-north', 'north', mockDominoes.sixSix, 0),
      createMockPlayedDomino('player-east', 'east', mockDominoes.fiveFive, 1),
      createMockPlayedDomino('player-south', 'south', mockDominoes.sixFour, 2),
      createMockPlayedDomino('player-west', 'west', mockDominoes.threeTwo, 3)
    ],
    winner: 'player-north',
    pointValue: 10,
    countDominoes: [],
    trickNumber: 1,
    isComplete: true
  },
  {
    id: 'trick-2',
    dominoes: [
      createMockPlayedDomino('player-east', 'east', mockDominoes.fiveBlank, 0),
      createMockPlayedDomino('player-south', 'south', mockDominoes.fourThree, 1),
      createMockPlayedDomino('player-west', 'west', mockDominoes.twoOne, 2),
      createMockPlayedDomino('player-north', 'north', mockDominoes.sixThree, 3)
    ],
    winner: 'player-south',
    pointValue: 5,
    countDominoes: [],
    trickNumber: 2,
    isComplete: true
  },
  {
    id: 'trick-3',
    dominoes: [
      createMockPlayedDomino('player-south', 'south', mockDominoes.fourFour, 0),
      createMockPlayedDomino('player-west', 'west', mockDominoes.threeOne, 1),
      createMockPlayedDomino('player-north', 'north', mockDominoes.sixOne, 2),
      createMockPlayedDomino('player-east', 'east', mockDominoes.twoBlank, 3)
    ],
    winner: 'player-north',
    pointValue: 0,
    countDominoes: [],
    trickNumber: 3,
    isComplete: true
  },
  {
    id: 'trick-4',
    dominoes: [
      createMockPlayedDomino('player-west', 'west', mockDominoes.oneOne, 0),
      createMockPlayedDomino('player-north', 'north', mockDominoes.fiveFour, 1),
      createMockPlayedDomino('player-east', 'east', mockDominoes.threeBlank, 2),
      createMockPlayedDomino('player-south', 'south', mockDominoes.twoTwo, 3)
    ],
    winner: 'player-east',
    pointValue: 0,
    countDominoes: [],
    trickNumber: 4,
    isComplete: true
  },
  {
    id: 'trick-5',
    dominoes: [
      createMockPlayedDomino('player-north', 'north', mockDominoes.oneBlank, 0),
      createMockPlayedDomino('player-east', 'east', mockDominoes.blankBlank, 1),
      createMockPlayedDomino('player-south', 'south', mockDominoes.fiveTwo, 2),
      createMockPlayedDomino('player-west', 'west', mockDominoes.fourTwo, 3)
    ],
    winner: 'player-east',
    pointValue: 5,
    countDominoes: [],
    trickNumber: 5,
    isComplete: true
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
    handScores: [],
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
    phase: 'bidding',
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
        { playerId: 'demo-north', amount: 30, trump: 6 as DominoSuit, isSpecialContract: false, timestamp: new Date().toISOString() }
      ],
      currentBid: { playerId: 'demo-north', amount: 30, trump: 6 as DominoSuit, isSpecialContract: false, timestamp: new Date().toISOString() },
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