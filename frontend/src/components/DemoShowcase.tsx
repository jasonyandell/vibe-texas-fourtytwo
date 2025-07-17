import React from 'react'
import { useParams } from 'react-router-dom'
import { DemoNavigation } from './DemoNavigation'
import { DominoesSection } from './DominoesSection'
import { PlayersSection } from './PlayersSection'
import { BiddingSection } from './BiddingSection'
import { GameBoardSection } from './GameBoardSection'
import styles from './DemoShowcase.module.css'

// Demo section types
export type DemoSection = 'dominoes' | 'players' | 'bidding' | 'board' | 'flow'

export const DemoShowcase: React.FC = () => {
  const { section } = useParams<{ section?: DemoSection }>()
  const currentSection = section || 'dominoes'

  return (
    <div
      className={styles.demoShowcase}
      data-testid="demo-showcase"
      aria-label="Texas 42 Demo Showcase"
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <header className={styles.header}>
        <h1>Texas 42 Demo Showcase</h1>
        <p>Explore the components and mechanics of the authentic Texas 42 domino game</p>
      </header>

      <DemoNavigation currentSection={currentSection} />

      <main className={styles.content} id="main-content">
        <div className={styles.sectionsContainer}>
          {/* Dominoes Section */}
          <section
            className={`${styles.section} ${currentSection === 'dominoes' ? styles.active : ''}`}
            data-testid="dominoes-section"
            aria-label="Dominoes Collection"
          >
            <h2>Dominoes Collection</h2>
            <p>Complete double-6 domino set with point values and interactive features.</p>
            {currentSection === 'dominoes' && (
              <DominoesSection />
            )}
          </section>

          {/* Players Section */}
          <section
            className={`${styles.section} ${currentSection === 'players' ? styles.active : ''}`}
            data-testid="players-section"
            aria-label="Players and Partnerships"
          >
            <h2>Players & Partnerships</h2>
            <p>Baseball diamond layout with North-South vs East-West partnerships.</p>
            {currentSection === 'players' && (
              <PlayersSection />
            )}
          </section>

          {/* Bidding Section */}
          <section
            className={`${styles.section} ${currentSection === 'bidding' ? styles.active : ''}`}
            data-testid="bidding-section"
            aria-label="Bidding System"
          >
            <h2>Bidding & Trump System</h2>
            <p>Interactive bidding with trump suit selection and bid validation.</p>
            {currentSection === 'bidding' && (
              <BiddingSection />
            )}
          </section>

          {/* Board Section */}
          <section
            className={`${styles.section} ${currentSection === 'board' ? styles.active : ''}`}
            data-testid="board-section"
            aria-label="Game Board"
          >
            <h2>Game Board & Trick Play</h2>
            <p>Center play area, trick stacks, and score displays.</p>
            {currentSection === 'board' && (
              <GameBoardSection />
            )}
          </section>

          {/* Flow Section */}
          <section 
            className={`${styles.section} ${currentSection === 'flow' ? styles.active : ''}`}
            data-testid="flow-section"
            aria-label="Game Flow"
          >
            <h2>Lobby & Game Management</h2>
            <p>Game creation, player management, and spectator mode.</p>
            {/* TODO: Add flow showcase content */}
          </section>
        </div>
      </main>
    </div>
  )
}
