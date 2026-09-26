import React, { useEffect } from "react";
import type { UserJobMatch, MatchStatus } from "../types/job";
import styles from "../styles/jobModal.module.css";

interface JobModalProps {
  match: UserJobMatch | null;
  onClose: () => void;
  onUpdateStatus: (matchId: number, status: MatchStatus) => void;
}

export const JobModal: React.FC<JobModalProps> = ({
  match,
  onClose,
  onUpdateStatus,
}) => {
  // Fecha o modal ao pressionar a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!match) return null;

  const { job, score, status } = match;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar no conteúdo do modal
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.headerTitle}>{job.title}</h2>
            <div className={styles.subHeader}>
              <span>🏢 {job.company}</span>
              <span>📍 {job.location || "Remoto / Não informado"}</span>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Aderência (Score)</span>
              <span className={styles.metaValue}>{score}% de compatibilidade</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Plataforma</span>
              <span className={styles.metaValue}>{job.source}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Status Atual</span>
              <div className={styles.statusSelector}>
                <select
                  value={status}
                  onChange={(e) =>
                    onUpdateStatus(match.id, e.target.value as MatchStatus)
                  }
                >
                  <option value="new">Nova</option>
                  <option value="viewed">Visualizada</option>
                  <option value="applied">Candidatado</option>
                  <option value="discarded">Descartada</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#38bdf8", marginBottom: "8px" }}>
              Descrição e Requisitos da Oportunidade
            </h4>
            <div className={styles.descriptionBox}>
              {job.description || "Nenhuma descrição detalhada informada."}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Fechar
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyBtn}
          >
            Ir para a vaga original ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobModal;

