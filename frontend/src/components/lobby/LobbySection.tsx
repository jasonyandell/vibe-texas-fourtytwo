import React from 'react';
import styles from './LobbySection.module.css';

export interface LobbySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const LobbySection: React.FC<LobbySectionProps> = ({
  children,
  className,
  ...props
}) => {
  const combinedClassName = className
    ? `${styles.lobbySection} ${className}`
    : styles.lobbySection;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};