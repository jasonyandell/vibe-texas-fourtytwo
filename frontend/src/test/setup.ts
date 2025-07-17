import { expect, afterEach, beforeEach, vi } from 'vitest';
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

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info
};

// Track console calls for test validation
let consoleCallsInCurrentTest: Array<{ type: string; args: unknown[] }> = [];

// Mock console methods to capture and suppress expected output
beforeEach(() => {
  consoleCallsInCurrentTest = [];

  // Mock console methods to capture calls
  console.log = vi.fn((...args: unknown[]) => {
    consoleCallsInCurrentTest.push({ type: 'log', args });
    // Only suppress specific expected messages
    const message = args.join(' ');
    if (message.includes('URL compression:') ||
        message.includes('using lz-string') ||
        message.includes('compression ratio')) {
      return; // Suppress expected compression logging
    }
    originalConsole.log(...args);
  });

  console.warn = vi.fn((...args: unknown[]) => {
    consoleCallsInCurrentTest.push({ type: 'warn', args });
    const message = args.join(' ');
    if (message.includes('Fallback decompression successful') ||
        message.includes('Compression method') ||
        message.includes('Unknown game state version')) {
      return; // Suppress expected warnings
    }
    originalConsole.warn(...args);
  });

  console.error = vi.fn((...args: unknown[]) => {
    consoleCallsInCurrentTest.push({ type: 'error', args });
    const message = args.join(' ');
    if (message.includes('URL parsing failed:') ||
        message.includes('Failed to decompress game state') ||
        message.includes('Failed to parse URL params') ||
        message.includes('Converted game state is invalid') ||
        message.includes('Failed to convert to game state') ||
        message.includes('Failed to parse shareable URL') ||
        message.includes('GameState context not available')) {
      return; // Suppress expected errors from tests
    }
    originalConsole.error(...args);
  });

  console.info = vi.fn((...args: unknown[]) => {
    consoleCallsInCurrentTest.push({ type: 'info', args });
    originalConsole.info(...args);
  });
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();

  // Restore original console methods
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.info = originalConsole.info;

  // Clear console calls for next test
  consoleCallsInCurrentTest = [];
});

// Export helper for tests that need to check console calls
export const getConsoleCallsInCurrentTest = () => [...consoleCallsInCurrentTest];

// Type declarations for jest-dom matchers with Vitest
// Import the official vitest types from @testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
