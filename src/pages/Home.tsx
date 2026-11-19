import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserJobMatch, MatchStatus } from "../types/job";
import { jobStorageService, type OfflineSource } from "../services/jobStorage";
import { getErrorMessage } from "../services/api";
import { profileService } from "../services/profileService";
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
  // null = dados vindos da API; "cache"/"seed" = modo offline escolhido pelo usuário
  const [offlineSource, setOfflineSource] = useState<OfflineSource | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Estados dos Filtros (Inicializa o minScore com base no perfil do candidato)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [profileMinScore, setProfileMinScore] = useState<number>(70);
  const [minScore, setMinScore] = useState<number>(70);
  const minScoreInitialized = useRef(false);

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

  /**
   * Carrega perfil + vagas da API na montagem da página. "Tentar novamente" e "Reconectar"
   * incrementam reloadKey para o efeito rodar de novo. Falhas viram o estado de erro.
   */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const isActive = () => active;

    const fetchPageData = async () => {
      // 1. Perfil: só define a nota mínima do filtro; uma falha aqui não impede a lista
      try {
        const profile = await profileService.getActiveProfile();
        const preferredMin = profile?.min_score ?? 70;
        if (isActive()) {
          setProfileMinScore(preferredMin);
          if (!minScoreInitialized.current) {
            setMinScore(preferredMin);
            minScoreInitialized.current = true;
          }
        }
      } catch (err) {
        console.warn("Perfil indisponível, usando nota mínima padrão:", err);
      }

      // 2. Vagas
      try {
        const data = await jobStorageService.fetchJobs();
        if (isActive()) {
          setMatches(data);
          setOfflineSource(null);
          setLastUpdated(jobStorageService.getLastUpdated());
        }
      } catch (err) {
        if (isActive()) {
          setError(getErrorMessage(err, "Falha ao carregar as vagas. Tente novamente mais tarde."));
        }
      } finally {
        if (isActive()) {
          setLoading(false);
        }
      }
    };

    void fetchPageData();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  // "Tentar novamente" / "Reconectar": volta ao estado de carregamento e refaz a requisição
  const loadJobs = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  // Contingência: o usuário escolhe ver os dados salvos neste navegador (ou de demonstração)
  const handleUseOfflineData = () => {
    const offline = jobStorageService.loadOfflineJobs();
    setMatches(offline.matches);
    setOfflineSource(offline.source);
    setError(null);
  };

  // No modo offline nada é enviado ao servidor, então alterações ficam bloqueadas
  const blockIfOffline = (): boolean => {
    if (offlineSource) {
      showToast("Modo offline: reconecte à API para salvar alterações.");
      return true;
    }
    return false;
  };

  // Substitui o item pela versão confirmada pelo servidor
  const applyServerUpdate = (updated: UserJobMatch) => {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMatch((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  // Executa busca e scraping manualmente a pedido do usuário
  const handleManualRefresh = async () => {
    if (blockIfOffline()) return;
    setIsRefreshing(true);
    try {
      const result = await jobStorageService.manualRefreshJobs();
      setMatches(result.matches);
      setLastUpdated(result.updatedAt);
      showToast(
        result.success
          ? `✨ ${result.totalJobs} vagas sincronizadas com sucesso a partir da API da Gupy!`
          : `ℹ️ ${result.message}`
      );
    } catch (err) {
      showToast(`⚠️ ${getErrorMessage(err, "Não foi possível sincronizar no momento.")}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Favoritos: só muda na tela depois que a API confirmar (Requisito 8)
  const handleToggleFavorite = async (matchId: number) => {
    if (blockIfOffline()) return;
    const current = matches.find((m) => m.id === matchId);
    if (!current) return;

    try {
      const updated = await jobStorageService.updateMatch(matchId, {
        is_favorite: !current.is_favorite,
      });
      applyServerUpdate(updated);
      showToast(
        updated.is_favorite
          ? `⭐ Vaga "${updated.job.title}" salva nos favoritos!`
          : `Vaga "${updated.job.title}" removida dos favoritos.`
      );
    } catch (err) {
      showToast(`⚠️ ${getErrorMessage(err, "Não foi possível salvar o favorito.")}`);
    }
  };

  // Status da candidatura: só muda na tela depois que a API confirmar (Requisito 8)
  const handleUpdateStatus = async (matchId: number, status: MatchStatus) => {
    if (blockIfOffline()) return;
    try {
      const updated = await jobStorageService.updateMatch(matchId, { status });
      applyServerUpdate(updated);
      showToast(`✓ Etapa da vaga atualizada para "${status}" com sucesso!`);
    } catch (err) {
      showToast(`⚠️ ${getErrorMessage(err, "Não foi possível atualizar o status.")}`);
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
                {user?.name || user?.email?.split("@")[0] || "Candidato"}
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
            <span className={styles.heroTag}>Tecnologia</span>
            <h1 className={styles.heroTitle}>Oportunidades Recomendadas</h1>
            <p className={styles.heroSubtitle}>
              Vagas selecionadas por IA e coletadas ao vivo da API da Gupy com base no seu perfil.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button
              className={styles.refreshButton}
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Buscar novas vagas ao vivo na API da Gupy"
            >
              {isRefreshing ? (
                <>
                  <span className={styles.spinIcon}>•</span>
                  <span>Sincronizando...</span>
                </>
              ) : (
                <span>Atualizar Vagas</span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Status de Sincronização */}
        <div className={styles.syncStatusBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>
              Fonte: <strong>Gupy API</strong> (Dedup SHA-256 + NLP)
            </span>
          </div>

          <div className={styles.statusMeta}>
            <span
              className={styles.statusMetaItem}
              title={
                lastUpdated
                  ? `Sincronização em: ${formatFullDateTime(lastUpdated)}`
                  : "Aguardando sincronização"
              }
            >
              Última varredura: <strong>{formatRelativeTime(lastUpdated)}</strong>
            </span>
            <span className={styles.statusMetaItem}>
              <strong>{matches.length}</strong> vagas disponíveis
            </span>
          </div>
        </div>
      </section>

      {/* 3. Toolbar de Filtros e Busca */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersBar}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Filtrar por cargo, stack ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterControls}>
            <select
              className={styles.selectInput}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              title="Filtrar vagas pela aderência do algoritmo de Match IA"
            >
              {profileMinScore > 0 && (
                <option value={profileMinScore}>
                  🎯 Meu Perfil (Match ≥ {profileMinScore}%)
                </option>
              )}
              <option value={0}>Todas as Vagas (Qualquer Match)</option>
              {profileMinScore !== 70 && <option value={70}>Match ≥ 70%</option>}
              {profileMinScore !== 80 && <option value={80}>Match ≥ 80%</option>}
              {profileMinScore !== 90 && <option value={90}>Match ≥ 90%</option>}
            </select>

            <button
              className={`${styles.favToggleBtn} ${
                onlyFavorites ? styles.favToggleActive : ""
              }`}
              onClick={() => setOnlyFavorites(!onlyFavorites)}
            >
              {onlyFavorites ? "★ Apenas Favoritas" : "☆ Todas as Vagas"}
            </button>
          </div>
        </div>

        <div className={styles.toolbarMetaRow}>
          <span>
            Exibindo <strong>{filteredMatches.length}</strong> de <strong>{matches.length}</strong> vagas disponíveis
            {minScore > 0 ? (
              <span style={{ color: "#38bdf8", marginLeft: "6px" }}>
                (filtrando por Match ≥ {minScore}%)
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: "6px" }}>
                (todas as notas)
              </span>
            )}
          </span>
          {(searchTerm || onlyFavorites || minScore !== profileMinScore) && (
            <button
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSearchTerm("");
                setOnlyFavorites(false);
                setMinScore(profileMinScore);
              }}
              title="Restaurar critérios do perfil e limpar busca"
            >
              Restaurar filtros do perfil (≥ {profileMinScore}%)
            </button>
          )}
        </div>
      </section>

      {/* Modo offline: deixa claro que os dados são locais e não serão salvos no servidor */}
      {offlineSource && !loading && (
        <div className={styles.offlineBanner} role="status">
          <span>
            <strong>Modo offline:</strong>{" "}
            {offlineSource === "cache"
              ? "exibindo as últimas vagas salvas neste navegador."
              : "exibindo vagas de demonstração (nenhum dado salvo neste navegador)."}{" "}
            Alterações estão desativadas até reconectar.
          </span>
          <button className={styles.actionButton} onClick={loadJobs}>
            Reconectar
          </button>
        </div>
      )}

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
            <div className={styles.feedbackActions}>
              <button className={styles.actionButton} onClick={loadJobs}>
                Tentar novamente
              </button>
              <button
                className={styles.secondaryActionButton}
                onClick={handleUseOfflineData}
                title="Exibir as últimas vagas salvas neste navegador (somente leitura)"
              >
                Usar dados salvos (offline)
              </button>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className={styles.feedbackContainer}>
            <span style={{ fontSize: "36px", marginBottom: "12px" }}>🔎</span>
            <h3 className={styles.feedbackTitle}>Nenhuma vaga atende aos filtros atuais</h3>
            <p className={styles.feedbackText}>
              {minScore > 0
                ? `Nenhuma oportunidade atingiu a nota mínima de ${minScore}% configurada no seu perfil. Você pode ver todas as vagas ou ajustar suas habilidades no perfil.`
                : "Nenhuma oportunidade corresponde aos filtros de busca aplicados. Tente buscar novas vagas na Gupy."}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {minScore > 0 && (
                <button
                  className={styles.actionButton}
                  onClick={() => setMinScore(0)}
                  title="Ver todas as vagas sem filtro de nota mínima"
                >
                  Ver Todas as Vagas (Qualquer Match)
                </button>
              )}
              <Link
                to="/perfil"
                className={styles.actionButton}
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                ⚙️ Ajustar Skills no Meu Perfil
              </Link>
              <button
                className={styles.actionButton}
                onClick={handleManualRefresh}
                style={{ background: "#2563eb" }}
              >
                Buscar Novas Vagas na Gupy
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
