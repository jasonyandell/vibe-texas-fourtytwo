import type { Meta, StoryObj } from '@storybook/react';
import { CreateGameModal } from './CreateGameModal';
import { useState } from 'react';

const meta = {
  title: 'Lobby/CreateGameModal',
  component: CreateGameModal,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onCreateGame: { action: 'createGame' },
    onClose: { action: 'close' },
  },
} satisfies Meta<typeof CreateGameModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreateGame: (gameName: string) => {
      console.log('Creating game:', gameName);
    },
    onClose: () => {
      console.log('Modal closed');
    },
  },
};

export const WithError: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  render: (args) => {
    return (
      <CreateGameModal
        {...args}
        onCreateGame={(gameName: string) => {
          console.log('Attempting to create game:', gameName);
          throw new Error('Game name already exists');
        }}
      />
    );
  },
};

export const FormValidation: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story showing form validation states. Try entering short names, special characters, or leaving the field empty.',
      },
    },
  },
  render: (args) => {
    return (
      <CreateGameModal
        {...args}
        onCreateGame={(gameName: string) => {
          console.log('Valid game name submitted:', gameName);
          args.onClose();
        }}
      />
    );
  },
};

export const CreatingState: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  render: (args) => {
    return (
      <CreateGameModal
        {...args}
        onCreateGame={async (gameName: string) => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Game created:', gameName);
          args.onClose();
        }}
      />
    );
  },
};

export const NetworkError: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  render: (args) => {
    return (
      <CreateGameModal
        {...args}
        onCreateGame={(gameName: string) => {
          console.log('Attempting to create game:', gameName);
          throw new Error('Network request failed');
        }}
      />
    );
  },
};

export const ServerValidationError: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  render: (args) => {
    return (
      <CreateGameModal
        {...args}
        onCreateGame={(gameName: string) => {
          console.log('Attempting to create game:', gameName);
          // Simulate server validation error
          const error = new Error('Validation failed') as Error & {
            response?: { data: { message: string } };
          };
          error.response = {
            data: {
              message: 'Game name contains inappropriate content',
            },
          };
          throw error;
        }}
      />
    );
  },
};

export const Interactive: Story = {
  args: {
    onCreateGame: () => {},
    onClose: () => {},
  },
  render: function InteractiveStory() {
    const [isOpen, setIsOpen] = useState(true);
    const [createdGames, setCreatedGames] = useState<string[]>([]);

    if (!isOpen) {
      return (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Open Create Game Modal
          </button>
          {createdGames.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Created Games:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {createdGames.map((game, index) => (
                  <li key={index} style={{ margin: '5px 0' }}>
                    {game}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return (
      <CreateGameModal
        onCreateGame={async (gameName: string) => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setCreatedGames([...createdGames, gameName]);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    );
  },
};