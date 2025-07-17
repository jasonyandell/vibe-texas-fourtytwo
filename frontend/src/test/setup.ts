import { expect, afterEach } from 'vitest';
import { cleanup, configure } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { act } from 'react';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Configure testing library to improve test reliability
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000
});

// Make React's act globally available for tests
(global as typeof globalThis & { act: typeof act }).act = act;

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Note: All console.warn suppressions removed - warnings should be fixed at source

// Type declarations for jest-dom matchers with Vitest
// Import the official vitest types from @testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
