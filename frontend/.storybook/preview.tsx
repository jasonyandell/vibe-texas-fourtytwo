import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { GameStateProvider } from '../src/contexts/GameStateContext'
import '../src/index.css'
import '../src/App.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      // For GameBoard stories, use the game route
      const isGameBoardStory = context.title?.includes('GameBoard');
      const initialEntries = isGameBoardStory ? ['/game/test-game-123'] : ['/'];
      
      return (
        <MemoryRouter initialEntries={initialEntries}>
          <GameStateProvider>
            <div style={{ minHeight: '100vh', background: 'var(--color-felt-green)' }}>
              <Story />
            </div>
          </GameStateProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;