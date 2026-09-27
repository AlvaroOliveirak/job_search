// src/components/MatchBadge.tsx
import styles from "../styles/matchBadge.module.css";

export type MatchBadgeProps = {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
};

function MatchBadge({
  score,
  size = "md",
  className = "",
  showIcon = true,
}: MatchBadgeProps) {
  const getLevelClass = () => {
    if (score >= 90) return styles.highMatch;
    if (score >= 80) return styles.mediumMatch;
    return styles.standardMatch;
  };

  const getSizeClass = () => {
    if (size === "sm") return styles.sizeSm;
    if (size === "lg") return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <span
      className={`${styles.badge} ${getLevelClass()} ${getSizeClass()} ${className}`}
      title={`Pontuação de afinidade estimada pela IA: ${score}%`}
    >
      {showIcon && <span>⭐</span>}
      <span>{score}% Match</span>
    </span>
  );
}

export default MatchBadge;
