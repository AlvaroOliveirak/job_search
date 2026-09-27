// src/components/ResumeUpload.tsx
import { useId, type ChangeEvent } from "react";
import styles from "../styles/resumeUpload.module.css";

export type ResumeUploadProps = {
  fileName?: string | null;
  onFileSelect: (file: File) => void;
  label?: string;
  buttonText?: string;
  accept?: string;
  variant?: "compact" | "box";
  hint?: string;
  className?: string;
};

function ResumeUpload({
  fileName,
  onFileSelect,
  label = "Currículo:",
  buttonText = "📎 Anexar Currículo (PDF/DOCX)",
  accept = ".pdf,.doc,.docx",
  variant = "compact",
  hint = "O arquivo é processado para identificar suas habilidades e gerar match automático.",
  className = "",
}: ResumeUploadProps) {
  const inputId = useId();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`${styles.uploadContainer} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}

      <input
        type="file"
        id={inputId}
        accept={accept}
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />

      {variant === "box" ? (
        <label
          htmlFor={inputId}
          className={`${styles.uploadBox} ${fileName ? styles.fileActive : ""}`}
        >
          <span className={styles.uploadIcon}>{fileName ? "📄" : "📤"}</span>
          <strong>
            {fileName ? fileName : "Clique para selecionar o currículo"}
          </strong>
          <span className={styles.uploadHint}>{hint}</span>
        </label>
      ) : (
        <label
          htmlFor={inputId}
          className={`${styles.uploadButtonCompact} ${
            fileName ? styles.fileActive : ""
          }`}
        >
          {fileName ? <>📄 {fileName}</> : <>{buttonText}</>}
        </label>
      )}
    </div>
  );
}

export default ResumeUpload;
