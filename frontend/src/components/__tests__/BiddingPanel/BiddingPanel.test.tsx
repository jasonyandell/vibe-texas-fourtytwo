import { describe, vi, beforeEach } from 'vitest';
import { testHelpers } from './test-helpers';
import { renderingTests } from './rendering.test';
import { trumpSelectionTests } from './trump-selection.test';
import { bidAmountTests } from './bid-amount.test';
import { validationTests } from './validation.test';
import { submissionTests } from './submission.test';
import { accessibilityTests } from './accessibility.test';

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