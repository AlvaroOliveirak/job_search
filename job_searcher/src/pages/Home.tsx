import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserJobMatch, MatchStatus } from "../types/job";
import { jobStorageService } from "../services/jobStorage";
import { JobCard, JobModal, Logo } from "../components";
import styles from "../styles/home.module.css";
import { useAuth } from "../hooks/useAuth";
import { formatFullDateTime, formatRelativeTime } from "../utils/dateUtils";

export function Home() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<UserJobMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(jobStorageService.getLastUpdated());
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [minScore, setMinScore] = useState<number>(0);

  // Estado do Modal de Detalhes
  const [selectedMatch, setSelectedMatch] = useState<UserJobMatch | null>(null);

  // Mensagem condicional de resultado de ação (Requisito 8 da AV1)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Carrega as vagas usando a camada de serviço (Repository)
  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobStorageService.fetchJobs();
      setMatches(data);
      setLastUpdated(jobStorageService.getLastUpdated());
    } catch (err) {
      setError("Falha ao carregar as vagas. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Executa busca e scraping manualmente a pedido do usuário
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await jobStorageService.manualRefreshJobs();
      setMatches(result.matches);
      setLastUpdated(result.updatedAt);
      showToast(`✨ ${result.totalJobs} vagas sincronizadas com sucesso a partir da API da Gupy!`);
    } catch (err) {
      console.error("Erro ao atualizar vagas manualmente:", err);
      showToast("⚠️ Não foi possível sincronizar no momento. Vagas locais mantidas.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await jobStorageService.fetchJobs();
        if (isActive) {
          setMatches(data);
          setLastUpdated(jobStorageService.getLastUpdated());
        }
      } catch (err) {
        if (isActive) {
          setError("Falha ao carregar as vagas. Tente novamente mais tarde.");
          console.error(err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchJobs();

    return () => {
      isActive = false;
    };
  }, []);

  // Manipulação de favoritos via serviço com feedback visual (Requisito 8)
  const handleToggleFavorite = async (matchId: number) => {
    try {
      const updated = await jobStorageService.toggleFavorite(matchId);
      setMatches(updated);
      const target = updated.find((m) => m.id === matchId);
      if (target) {
        showToast(
          target.is_favorite
            ? `⭐ Vaga "${target.job.title}" salva nos favoritos!`
            : `Vaga "${target.job.title}" removida dos favoritos.`
        );
      }
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch((prev) =>
          prev ? { ...prev, is_favorite: !prev.is_favorite } : null
        );
      }
    } catch (err) {
      console.error("Erro ao favoritar vaga:", err);
    }
  };

  // Manipulação de status via serviço com feedback visual (Requisito 8)
  const handleUpdateStatus = async (matchId: number, status: MatchStatus) => {
    try {
      const updated = await jobStorageService.updateStatus(matchId, status);
      setMatches(updated);
      showToast(`✓ Etapa da vaga atualizada para "${status}" com sucesso!`);
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
        <Logo size={42} showTagline={true} taglineText="Carreiras & Match IA" asLink={true} />
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={styles.navLink} style={{ color: "#38bdf8", fontWeight: 600 }}>
            Vagas
          </Link>
          <Link to="/candidaturas" className={styles.navLink}>
            Minhas Candidaturas
          </Link>
          <Link to="/perfil" className={styles.navLink}>
            Meu Perfil
          </Link>
          {isLoggedIn && (
            <div className={styles.userNavGroup}>
              <span className={styles.userNamePill}>
                👤 {user?.name || "Candidato"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutBtn}
                title="Encerrar sessão e voltar ao início"
              >
                🚪 Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.heroTitle}>Oportunidades em Destaque</h1>
            <p className={styles.heroSubtitle}>
              Vagas ranqueadas pelo motor de pontuação de acordo com o seu perfil de busca.
            </p>
          </div>
          <div className={styles.heroActions}>
            <button
              className={styles.refreshButton}
              onClick={handleManualRefresh}
              disabled={isRefreshing || loading}
              title="Disparar busca e atualização manual de vagas via API"
            >
              <span className={isRefreshing ? styles.spinIcon : ""}>🔄</span>
              <span>{isRefreshing ? "Buscando vagas na Gupy..." : "Buscar Vagas Manualmente"}</span>
            </button>
          </div>
        </div>

        {/* Barra de Status e Atualização */}
        <div className={styles.syncStatusBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>
              Última atualização:{" "}
              <strong>
                {lastUpdated
                  ? `${formatFullDateTime(lastUpdated)} (${formatRelativeTime(lastUpdated)})`
                  : "Aguardando sincronização"}
              </strong>
            </span>
          </div>
          <span className={styles.badgeTotalJobs}>
            ⚡ {matches.length} vagas indexadas no sistema
          </span>
        </div>
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
            <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button className={styles.actionButton} onClick={loadJobs}>
                Tentar novamente
              </button>
              <button
                className={styles.refreshButton}
                onClick={handleManualRefresh}
                disabled={isRefreshing}
              >
                <span className={isRefreshing ? styles.spinIcon : ""}>🔄</span>
                <span>Buscar Vagas Manualmente</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Estado de Lista Vazia (Empty State) */}
        {!loading && !error && filteredMatches.length === 0 && (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "42px", marginBottom: "12px" }}>🔍</span>
            <h2 className={styles.feedbackTitle}>Nenhuma vaga encontrada</h2>
            <p className={styles.feedbackText}>
              Não localizamos nenhuma oportunidade com os filtros atuais. Tente buscar outros termos ou buscar novas vagas na API.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
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
              <button
                className={styles.refreshButton}
                onClick={handleManualRefresh}
                disabled={isRefreshing}
              >
                <span className={isRefreshing ? styles.spinIcon : ""}>🔄</span>
                <span>Buscar Vagas Manualmente</span>
              </button>
            </div>
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

      {/* Toast de feedback de ação (Requisito 8 da AV1) */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Home;

