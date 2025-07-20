import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LobbySection } from './LobbySection';
import styles from './LobbySection.module.css';

describe('LobbySection', () => {
  it('renders children content', () => {
    render(
      <LobbySection>
        <div>Test Content</div>
      </LobbySection>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies section styling', () => {
    const { container } = render(
      <LobbySection>
        <div>Content</div>
      </LobbySection>
    );
    
    const section = container.firstChild;
    expect(section).toHaveClass(styles.lobbySection);
  });

  it('renders with optional title', () => {
    render(
      <LobbySection title="Active Games">
        <div>Games list</div>
      </LobbySection>
    );
    
    expect(screen.getByText('Active Games')).toBeInTheDocument();
    expect(screen.getByText('Games list')).toBeInTheDocument();
  });

  it('renders without title when not provided', () => {
    render(
      <LobbySection>
        <div>No title section</div>
      </LobbySection>
    );
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('No title section')).toBeInTheDocument();
  });

  it('applies additional className when provided', () => {
    const { container } = render(
      <LobbySection className="customClass">
        <div>Content</div>
      </LobbySection>
    );
    
    const section = container.firstChild;
    expect(section).toHaveClass(styles.lobbySection);
    expect(section).toHaveClass('customClass');
  });
});