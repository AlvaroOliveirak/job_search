import React from "react";
import type { UserJobMatch } from "../types/job";
import styles from "../styles/jobCard.module.css";

interface JobCardProps {
  match: UserJobMatch;
  onViewDetails: (match: UserJobMatch) => void;
  onToggleFavorite: (matchId: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  match,
  onViewDetails,
  onToggleFavorite,
}) => {
  const { job, score, is_favorite } = match;

  const getScoreBadgeClass = (s: number) => {
    if (s >= 85) return `${styles.scoreBadge} ${styles.scoreHigh}`;
    if (s >= 70) return `${styles.scoreBadge} ${styles.scoreMedium}`;
    return `${styles.scoreBadge} ${styles.scoreLow}`;
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badgesContainer}>
          <span className={getScoreBadgeClass(score)}>
            ★ {score}% Match
          </span>
          <span className={styles.sourceBadge}>{job.source}</span>
        </div>

        <button
          className={`${styles.favBtn} ${is_favorite ? styles.favActive : ""}`}
          onClick={() => onToggleFavorite(match.id)}
          title={is_favorite ? "Remover dos favoritos" : "Salvar como favorita"}
          aria-label="Favoritar vaga"
        >
          {is_favorite ? "♥" : "♡"}
        </button>
      </div>

      <div>
        <h3 className={styles.title}>{job.title}</h3>
        <div className={styles.companyRow}>
          <span>🏢 {job.company}</span>
        </div>
      </div>

      <div className={styles.location}>
        <span>📍 {job.location || "Local não informado"}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.detailsBtn}
          onClick={() => onViewDetails(match)}
        >
          Ver Detalhes
        </button>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkBtn}
        >
          Candidatar-se ↗
        </a>
      </div>
    </article>
  );
};

export default JobCard;

