import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Ready Status Display', () => {
  it('shows ready status for waiting games', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    expect(screen.getAllByText('Ready')).toHaveLength(2); // Alice and Charlie are ready
    expect(screen.getAllByText('Not Ready')).toHaveLength(1); // Bob is not ready
  });

  it('hides ready status for playing games', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="playing" />);
    
    expect(screen.queryByText('Ready')).not.toBeInTheDocument();
    expect(screen.queryByText('Not Ready')).not.toBeInTheDocument();
  });

  it('hides ready status for finished games', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="finished" />);
    
    expect(screen.queryByText('Ready')).not.toBeInTheDocument();
    expect(screen.queryByText('Not Ready')).not.toBeInTheDocument();
  });

  it('applies correct badge variants for ready status', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    const readyBadges = screen.getAllByText('Ready');
    const notReadyBadges = screen.getAllByText('Not Ready');
    
    expect(readyBadges.length).toBeGreaterThan(0);
    expect(notReadyBadges.length).toBeGreaterThan(0);
  });
});