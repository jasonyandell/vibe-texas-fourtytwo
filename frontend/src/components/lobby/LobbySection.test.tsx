import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('applies section styling class', () => {
    const { container } = render(
      <LobbySection>
        <div>Content</div>
      </LobbySection>
    );

    const section = container.firstChild;
    expect(section).toHaveClass(styles.lobbySection);
  });

  it('renders with custom className when provided', () => {
    const { container } = render(
      <LobbySection className="customClass">
        <div>Content</div>
      </LobbySection>
    );

    const section = container.firstChild;
    expect(section).toHaveClass(styles.lobbySection);
    expect(section).toHaveClass('customClass');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <LobbySection data-testid="test-section" aria-label="Test Section">
        <div>Content</div>
      </LobbySection>
    );

    const section = container.firstChild as HTMLElement;
    expect(section).toHaveAttribute('data-testid', 'test-section');
    expect(section).toHaveAttribute('aria-label', 'Test Section');
  });
});