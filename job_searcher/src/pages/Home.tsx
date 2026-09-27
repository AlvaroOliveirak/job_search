import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { UserJobMatch, MatchStatus } from "../types/job";
import { jobStorageService } from "../services/jobStorage";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import styles from "../styles/home.module.css";

export function Home() {
  const [matches, setMatches] = useState<UserJobMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [minScore, setMinScore] = useState<number>(0);

  // Estado do Modal de Detalhes
  const [selectedMatch, setSelectedMatch] = useState<UserJobMatch | null>(null);

  // Carrega as vagas usando a camada de serviço (Repository)
  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobStorageService.fetchJobs();
      setMatches(data);
    } catch (err) {
      setError("Falha ao carregar as vagas. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Manipulação de favoritos via serviço
  const handleToggleFavorite = async (matchId: number) => {
    try {
      const updated = await jobStorageService.toggleFavorite(matchId);
      setMatches(updated);
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch((prev) =>
          prev ? { ...prev, is_favorite: !prev.is_favorite } : null
        );
      }
    } catch (err) {
      console.error("Erro ao favoritar vaga:", err);
    }
  };

  // Manipulação de status (ex: Candidatado / Descartada) via serviço
  const handleUpdateStatus = async (matchId: number, status: MatchStatus) => {
    try {
      const updated = await jobStorageService.updateStatus(matchId, status);
      setMatches(updated);
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Filtragem reativa na memória
  const filteredMatches = useMemo(() => {
    return matches.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.job.title.toLowerCase().includes(searchLower) ||
        item.job.company.toLowerCase().includes(searchLower) ||
        (item.job.location && item.job.location.toLowerCase().includes(searchLower));

      const matchesFavorite = onlyFavorites ? item.is_favorite : true;
      const matchesScore = item.score >= minScore;

      return matchesSearch && matchesFavorite && matchesScore;
    });
  }, [matches, searchTerm, onlyFavorites, minScore]);

  return (
    <div className={styles.container}>
      {/* Barra de Navegação */}
      <header className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          <span>⚡</span> JobSearcher
        </Link>
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={`${styles.navLink} ${styles.activeLink || ""}`} style={{ color: "#38bdf8" }}>
            Vagas Recomendadas
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Oportunidades em Destaque</h1>
        <p className={styles.heroSubtitle}>
          Vagas ranqueadas pelo motor de pontuação de acordo com o seu perfil de busca.
        </p>
      </section>

      {/* Barra de Filtros e Busca */}
      <section className={styles.filtersBar}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por cargo, tecnologia ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterControls}>
          <select
            className={styles.selectInput}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          >
            <option value={0}>Todas as notas</option>
            <option value={70}>Aderência +70%</option>
            <option value={85}>Alta Aderência +85%</option>
            <option value={90}>Top Matches +90%</option>
          </select>

          <button
            className={`${styles.favToggleBtn} ${onlyFavorites ? styles.favToggleActive : ""}`}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
          >
            <span>{onlyFavorites ? "♥" : "♡"}</span>
            <span>Apenas Favoritas</span>
          </button>
        </div>
      </section>

      {/* Renderização Condicional de Estados (Requisito Acadêmico) */}
      <main>
        {/* 1. Estado de Carregamento (Loading) */}
        {loading && (
          <div className={styles.feedbackContainer}>
            <div className={styles.spinner}></div>
            <h2 className={styles.feedbackTitle}>Buscando vagas no banco de dados...</h2>
            <p className={styles.feedbackText}>
              Aguarde enquanto cruzamos as melhores oportunidades para você.
            </p>
          </div>
        )}

        {/* 2. Estado de Erro */}
        {!loading && error && (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</span>
            <h2 className={styles.feedbackTitle}>Ops! Algo deu errado</h2>
            <p className={styles.feedbackText}>{error}</p>
            <button className={styles.actionButton} onClick={loadJobs}>
              Tentar novamente
            </button>
          </div>
        )}

        {/* 3. Estado de Lista Vazia (Empty State) */}
        {!loading && !error && filteredMatches.length === 0 && (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "42px", marginBottom: "12px" }}>🔍</span>
            <h2 className={styles.feedbackTitle}>Nenhuma vaga encontrada</h2>
            <p className={styles.feedbackText}>
              Não localizamos nenhuma oportunidade com os filtros atuais. Tente buscar outros termos ou remover o filtro de favoritos.
            </p>
            <button
              className={styles.actionButton}
              onClick={() => {
                setSearchTerm("");
                setOnlyFavorites(false);
                setMinScore(0);
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* 4. Estado de Sucesso (Lista Renderizada) */}
        {!loading && !error && filteredMatches.length > 0 && (
          <div>
            <div style={{ marginBottom: "16px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
              Exibindo <strong>{filteredMatches.length}</strong> {filteredMatches.length === 1 ? "vaga compatível" : "vagas compatíveis"}
            </div>
            <div className={styles.jobsGrid}>
              {filteredMatches.map((match) => (
                <JobCard
                  key={match.id}
                  match={match}
                  onViewDetails={(item) => setSelectedMatch(item)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Detalhes da Vaga */}
      <JobModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default Home;

