'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './MiniLogo.module.scss';

type AnimationMode = 'startup' | 'neon' | 'autoLoader' | 'static';

interface MiniLogoProps {
  size?: number;
  color?: string;
  mode?: AnimationMode;
  duration?: number;
  className?: string;
}

export const MiniLogo: React.FC<MiniLogoProps> = ({
  size = 200,
  color = '#ffffff',
  mode = 'startup',
  duration = 2000,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={clsx(styles.logo, styles[mode], className)}
      style={
        {
          '--logo-color': color,
          '--duration': `${duration}ms`,
        } as React.CSSProperties
      }
    >
      <defs>
        <filter id="neonGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="14" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        className={styles.arc}
        d="M 65 130 A 50 50 0 1 1 130 130"
        fill="none"
        stroke="var(--logo-color)"
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#neonGlow)"
      />

      <rect
        className={clsx(styles.base, styles.b1)}
        x="74"
        y="145"
        width="48"
        height="12"
        rx="6"
      />
      <rect
        className={clsx(styles.base, styles.b2)}
        x="80"
        y="160"
        width="36"
        height="10"
        rx="5"
      />
      <rect
        className={clsx(styles.base, styles.b3)}
        x="89"
        y="173"
        width="18"
        height="8"
        rx="4"
      />
    </svg>
  );
};
