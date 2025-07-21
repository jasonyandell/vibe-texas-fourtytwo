import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Basic Rendering', () => {
  it('renders all four player slots', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    expect(screen.getByText('North')).toBeInTheDocument();
    expect(screen.getByText('East')).toBeInTheDocument();
    expect(screen.getByText('South')).toBeInTheDocument();
    expect(screen.getByText('West')).toBeInTheDocument();
  });

  it('displays partnership information', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    expect(screen.getByText('North-South')).toBeInTheDocument();
    expect(screen.getByText('East-West')).toBeInTheDocument();
  });

  it('shows player names in partnership display', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    // North-South partnership
    const northSouthSection = screen.getByText('North-South').parentElement;
    expect(northSouthSection).toHaveTextContent('Alice');
    expect(northSouthSection).toHaveTextContent('Empty');
    
    // East-West partnership
    const eastWestSection = screen.getByText('East-West').parentElement;
    expect(eastWestSection).toHaveTextContent('Bob');
    expect(eastWestSection).toHaveTextContent('Charlie');
  });
});