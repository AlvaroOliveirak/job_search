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

  // Filtragem no cliente para resposta instantânea
  const filteredMatches = useMemo(() => {
    return matches.filter((item) => {
      const title = item.job.title.toLowerCase();
      const company = item.job.company.toLowerCase();
      const description = (item.job.description || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        title.includes(search) ||
        company.includes(search) ||
        description.includes(search);

      const matchesFav = onlyFavorites ? item.is_favorite : true;
      const matchesScore = item.score >= minScore;

      return matchesSearch && matchesFav && matchesScore;
    });
  }, [matches, searchTerm, onlyFavorites, minScore]);

  return (
    <div className={styles.container}>
      {/* 1. Navbar */}
      <header className={styles.navbar}>
        <Logo size={42} showTagline={true} taglineText="Carreiras & Match IA" asLink={true} />
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={`${styles.navLink} ${styles.navLinkActive || ""}`}>
            Vagas
          </Link>
          <Link to="/candidaturas" className={styles.navLink}>
            Candidaturas
          </Link>
          <Link to="/perfil" className={styles.navLink}>
            Perfil
          </Link>
          {isLoggedIn ? (
            <div className={styles.userNavGroup}>
              <span className={styles.userNamePill}>
                👤 {user?.name || user?.email?.split("@")[0] || "Alvaro Oliver"}
              </span>
              <button
                onClick={handleLogout}
                className={styles.logoutBtn}
                title="Encerrar sessão"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.navLink}>
              Entrar
            </Link>
          )}
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <span className={styles.heroTag}>Oportunidades em Tecnologia</span>
            <h1 className={styles.heroTitle}>Oportunidades Recomendadas</h1>
            <p className={styles.heroSubtitle}>
              Vagas selecionadas por IA e coletadas diretamente da API oficial da Gupy de acordo com seu perfil.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button
              className={styles.refreshButton}
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Buscar novas vagas ao vivo na API da Gupy e recalcular compatibilidade com IA"
            >
              {isRefreshing ? (
                <>
                  <span className={styles.spinIcon}>🔄</span>
                  <span>Varrendo Gupy & IA...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Buscar Vagas Manualmente</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Status de Sincronização */}
        <div className={styles.syncStatusBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>
              Fonte: <strong>Gupy Live API</strong> (Dedup SHA-256 + NLP Matcher)
            </span>
          </div>

          <div className={styles.statusMeta}>
            <span
              className={styles.statusMetaItem}
              title={
                lastUpdated
                  ? `Sincronização completa em: ${formatFullDateTime(lastUpdated)}`
                  : "Aguardando sincronização"
              }
            >
              🕒 Última varredura: <strong>{formatRelativeTime(lastUpdated)}</strong>
            </span>
            <span className={styles.statusMetaItem}>
              📊 <strong>{matches.length}</strong> vagas disponíveis
            </span>
          </div>
        </div>
      </section>

      {/* 3. Filtros e Busca */}
      <section className={styles.filtersBar}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por cargo, tecnologia (ex: React, Java, Docker) ou empresa..."
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
            <option value={0}>Qualquer Aderência</option>
            <option value={70}>Match ≥ 70%</option>
            <option value={80}>Match ≥ 80%</option>
            <option value={90}>Match Alto (≥ 90%)</option>
          </select>

          <button
            className={`${styles.favToggleBtn} ${
              onlyFavorites ? styles.favToggleActive : ""
            }`}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
          >
            {onlyFavorites ? "♥ Apenas Favoritas" : "♡ Todas as Vagas"}
          </button>
        </div>
      </section>

      {/* 4. Lista / Grid de Vagas */}
      <main>
        {loading ? (
          <div className={styles.feedbackContainer}>
            <div className={styles.spinner}></div>
            <h3 className={styles.feedbackTitle}>Carregando oportunidades...</h3>
            <p className={styles.feedbackText}>
              Avaliando aderência e consultando repositório de vagas.
            </p>
          </div>
        ) : error ? (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</span>
            <h3 className={styles.feedbackTitle}>Erro ao consultar vagas</h3>
            <p className={styles.feedbackText}>{error}</p>
            <button className={styles.actionButton} onClick={loadJobs}>
              Tentar novamente
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "36px", marginBottom: "12px" }}>🔎</span>
            <h3 className={styles.feedbackTitle}>Nenhuma vaga encontrada</h3>
            <p className={styles.feedbackText}>
              Nenhuma oportunidade corresponde aos filtros aplicados. Tente ajustar o termo de busca ou clique em 'Buscar Vagas Manualmente'.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {(searchTerm || onlyFavorites || minScore > 0) && (
                <button
                  className={styles.actionButton}
                  onClick={() => {
                    setSearchTerm("");
                    setOnlyFavorites(false);
                    setMinScore(0);
                  }}
                >
                  Limpar Filtros
                </button>
              )}
              <button
                className={styles.actionButton}
                onClick={handleManualRefresh}
                style={{ background: "#2563eb" }}
              >
                Buscar Vagas na Gupy
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {filteredMatches.map((match) => (
              <JobCard
                key={match.id}
                match={match}
                onViewDetails={(m) => setSelectedMatch(m)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de Detalhes da Vaga */}
      <JobModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Toast Notification (Feedback de Ações do Requisito 8) */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Home;
