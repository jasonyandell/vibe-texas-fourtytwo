import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const classes = [
    'button',
    styles.button,
    variant,
    styles[variant],
    size,
    styles[size],
    loading ? 'loading' : '',
    loading ? styles.loading : '',
    fullWidth ? 'fullWidth' : '',
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className={`spinner ${styles.spinner}`} aria-hidden="true" />}
      <span className={loading ? `loadingText ${styles.loadingText}` : ''}>{children}</span>
    </button>
  );
};
