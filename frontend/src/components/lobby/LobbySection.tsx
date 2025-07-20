import React from 'react';
import styles from './LobbySection.module.css';

interface LobbySectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const LobbySection: React.FC<LobbySectionProps> = ({ 
  children, 
  title, 
  className 
}) => {
  const classNames = [styles.lobbySection, className].filter(Boolean).join(' ');

  return (
    <section className={classNames}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
};