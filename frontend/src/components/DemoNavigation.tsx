import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { DemoSection } from './DemoShowcase'
import styles from './DemoNavigation.module.css'

interface DemoNavigationProps {
  currentSection: DemoSection
}

const sections: Array<{ key: DemoSection; label: string; path: string }> = [
  { key: 'dominoes', label: 'Dominoes', path: '/demo/dominoes' },
  { key: 'players', label: 'Players', path: '/demo/players' },
  { key: 'bidding', label: 'Bidding', path: '/demo/bidding' },
  { key: 'board', label: 'Board', path: '/demo/board' },
  { key: 'flow', label: 'Flow', path: '/demo/flow' }
]

export const DemoNavigation: React.FC<DemoNavigationProps> = ({ currentSection }) => {
  const navigate = useNavigate()

  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(path)
    }
  }

  return (
    <nav 
      className={styles.demoNavigation} 
      data-testid="demo-navigation"
      role="navigation"
      aria-label="Demo sections navigation"
    >
      <ul className={styles.navList}>
        {sections.map(({ key, label, path }) => (
          <li key={key} className={styles.navItem}>
            <Link
              to={path}
              className={`${styles.navLink} ${currentSection === key ? styles.active : ''}`}
              data-testid={`nav-${key}`}
              aria-current={currentSection === key ? 'page' : undefined}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, path)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
