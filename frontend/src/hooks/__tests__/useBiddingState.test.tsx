import { describe, vi, beforeEach } from 'vitest';
import {
  mockUseGameStateContext,
  baseGameState,
  createMockContext
} from './useBiddingState.test.fixtures';

// Import all test suites
import './useBiddingState.initialization.test';
import './useBiddingState.validation.test';
import './useBiddingState.actions.test';
import './useBiddingState.utilities.test';

describe('useBiddingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameStateContext.mockReturnValue(createMockContext(baseGameState));
  });
});
