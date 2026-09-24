// src/components/Searchbar.tsx
import styles from "../styles/searchbar.module.css";

export type SearchbarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
};

function Searchbar({
  value,
  onChange,
  placeholder = "Buscar por cargo, tecnologia ou empresa...",
  onClear,
  className = "",
}: SearchbarProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`${styles.searchWrapper} ${className}`}>
      <span className={styles.searchIcon} aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          title="Limpar busca"
          aria-label="Limpar campo de busca"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Searchbar;
