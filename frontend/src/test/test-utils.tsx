/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Enhanced Router wrapper with future flags to prevent warnings
export const TestRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

// All-in-one wrapper for tests that need routing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestRouter>
      {children}
    </TestRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });



// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Re-export user event utilities
export { createUserEvent } from './user-event-utils';

// Override the default render with our custom one
export { customRender as render };
