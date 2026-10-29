// src/components/Logo.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/logo.module.css";

export interface LogoProps {
  size?: number;
  showTagline?: boolean;
  taglineText?: string;
  asLink?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 42,
  showTagline = true,
  taglineText = "Plataforma de Carreiras & Match IA",
  asLink = true,
  className,
}) => {
  const content = (
    <div className={`${styles.brandWrapper} ${className || ""}`}>
      <div className={styles.logoBadge} title="Job Search - Conectando Carreiras">
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logoSvg}
        >
          <defs>
            <linearGradient id={`logoGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <filter id={`logoGlow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="rgba(10, 25, 47, 0.95)"
            stroke={`url(#logoGradient-${size})`}
            strokeWidth="2"
            filter={`url(#logoGlow-${size})`}
          />
          <path
            d="M17 17C17 14.7909 18.7909 13 21 13H27C29.2091 13 31 14.7909 31 17V19H17V17Z"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="11"
            y="19"
            width="26"
            height="18"
            rx="4"
            fill="rgba(56, 189, 248, 0.12)"
            stroke={`url(#logoGradient-${size})`}
            strokeWidth="2"
          />
          <circle cx="23" cy="27" r="4.5" stroke="#38bdf8" strokeWidth="1.8" />
          <circle cx="23" cy="27" r="1.5" fill="#818cf8" />
          <path
            d="M26.2 30.2L30 34"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 28H18.5M27.5 28H36"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1.5 2"
          />
        </svg>
      </div>

      <div className={styles.titleGroup}>
        <span className={styles.title}>
          Job <span className={styles.titleHighlight}>Search</span>
        </span>
        {showTagline && <span className={styles.titleTagline}>{taglineText}</span>}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className={styles.brandLink}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
