import { describe, vi, beforeEach } from 'vitest';
import { testHelpers } from './test-helpers';
import { renderingTests } from './rendering-tests';
import { trumpSelectionTests } from './trump-selection-tests';
import { bidAmountTests } from './bid-amount-tests';
import { validationTests } from './validation-tests';
import { submissionTests } from './submission-tests';
import { accessibilityTests } from './accessibility-tests';

describe('BiddingPanel', () => {
  const mockOnBid = vi.fn();
  const mockOnPass = vi.fn();

  const defaultProps = testHelpers.createDefaultProps(mockOnBid, mockOnPass);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  renderingTests(defaultProps);
  trumpSelectionTests(defaultProps);
  bidAmountTests(defaultProps);
  validationTests(defaultProps);
  submissionTests(defaultProps, mockOnBid, mockOnPass);
  accessibilityTests(defaultProps);
});