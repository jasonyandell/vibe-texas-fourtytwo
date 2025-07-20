import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState - Basic Rendering', () => {
  describe('Basic Rendering', () => {
    it('renders empty state message', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText('There are currently no active games in the lobby.')).toBeInTheDocument();
      expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
    });

    it('renders empty state icon', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('has proper heading structure', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { name: 'No games available' });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('renders SVG icon with correct attributes', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toHaveAttribute('width', '64');
      expect(icon).toHaveAttribute('height', '64');
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('stroke', 'currentColor');
      expect(icon).toHaveAttribute('stroke-width', '2');
    });

    it('has proper accessibility attributes for icon', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders icon with correct SVG elements', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon.querySelector('rect')).toBeInTheDocument();
      expect(icon.querySelector('circle')).toBeInTheDocument();
      expect(icon.querySelector('path')).toBeInTheDocument();
    });
  });

  describe('Content Variations', () => {
    it('displays consistent messaging', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText('There are currently no active games in the lobby.')).toBeInTheDocument();
      expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
    });

    it('maintains consistent styling across renders', () => {
      const { rerender } = render(<EmptyState />);
      
      const firstRenderContainer = screen.getByText('No games available').closest('div');
      expect(firstRenderContainer?.className).toMatch(/emptyState/);
      
      rerender(<EmptyState onCreateGame={vi.fn()} />);
      
      const secondRenderContainer = screen.getByText('No games available').closest('div');
      expect(secondRenderContainer?.className).toMatch(/emptyState/);
    });
  });
});