import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithUser: Story = {
  args: {},
  decorators: [
    (Story) => (
      <>
        <Story />
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '20px',
          background: 'rgba(255,255,255,0.1)',
          padding: '8px 16px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ccc'
        }}>
          Player: John Doe
        </div>
      </>
    ),
  ],
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '375px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};