// src/components/JobCard.tsx
import MatchBadge from "./MatchBadge";
import Button from "./button";
import styles from "../styles/jobCard.module.css";

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  tags: string[];
  description: string;
  postedAt: string;
};

export type JobCardProps = {
  job: Job;
  isApplied?: boolean;
  onApply?: (id: number) => void;
  className?: string;
};

function JobCard({
  job,
  isApplied = false,
  onApply,
  className = "",
}: JobCardProps) {
  const handleApplyClick = () => {
    if (!isApplied && onApply) {
      onApply(job.id);
    }
  };

  return (
    <article className={`${styles.jobCard} ${className}`}>
      <div className={styles.jobHeader}>
        <div>
          <div className={styles.jobTitleRow}>
            <h4 className={styles.jobRole}>{job.title}</h4>
            <MatchBadge score={job.match} />
          </div>
          <span className={styles.jobCompany}>🏢 {job.company}</span>
        </div>
        <span className={styles.jobBadgeLocation}>
          {job.type} • {job.location}
        </span>
      </div>

      <p className={styles.jobDescription}>{job.description}</p>

      <div className={styles.jobTags}>
        {job.tags.map((tag) => (
          <span key={tag} className={styles.jobTag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.jobFooter}>
        <div className={styles.salaryInfo}>
          <span className={styles.jobSalary}>{job.salary}</span>
          <span className={styles.jobPostedAt}>⏱️ {job.postedAt}</span>
        </div>

        <Button
          onClick={handleApplyClick}
          className={isApplied ? styles.appliedBtn : styles.applyBtn}
          disabled={isApplied}
        >
          {isApplied ? "✓ Candidatura Enviada" : "Candidatar-se"}
        </Button>
      </div>
    </article>
  );
}

export default JobCard;
