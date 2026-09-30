// src/pages/Candidaturas.tsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserJobMatch, MatchStatus } from "../types/job";
import { jobStorageService } from "../services/jobStorage";
import { JobModal, Logo } from "../components";
import styles from "../styles/candidaturas.module.css";
import { useAuth } from "../hooks/useAuth";

type FilterTab = "all" | "applied" | "interview" | "discarded";

export function Candidaturas() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<UserJobMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<UserJobMatch | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  useEffect(() => {
    let isActive = true;

    const fetchCandidaturas = async () => {
      try {
        const data = await jobStorageService.fetchJobs();
        if (isActive) {
          setMatches(data);
        }
      } catch (err) {
        console.error("Erro ao carregar candidaturas:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchCandidaturas();

    return () => {
      isActive = false;
    };
  }, []);

  const handleUpdateStatus = async (matchId: number, status: MatchStatus) => {
    try {
      const updated = await jobStorageService.updateStatus(matchId, status);
      setMatches(updated);
      showToast(`✓ Etapa da candidatura alterada para "${status}" com sucesso!`);
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Consideramos candidaturas as vagas com status diferente de "new" (ou com candidatura iniciada)
  const candidateJobs = useMemo(() => {
    return matches.filter((item) => item.status !== "new");
  }, [matches]);

  // KPIs
  const totalApplied = candidateJobs.length;
  const inAnalysis = candidateJobs.filter((m) => m.status === "applied").length;
  const inInterview = candidateJobs.filter((m) => m.status === "interview").length;
  const avgScore =
    candidateJobs.length > 0
      ? Math.round(
          candidateJobs.reduce((acc, curr) => acc + curr.score, 0) /
            candidateJobs.length
        )
      : 0;

  // Filtragem conforme a aba selecionada
  const filteredJobs = useMemo(() => {
    if (activeTab === "applied") {
      return candidateJobs.filter((m) => m.status === "applied");
    }
    if (activeTab === "interview") {
      return candidateJobs.filter((m) => m.status === "interview");
    }
    if (activeTab === "discarded") {
      return candidateJobs.filter(
        (m) => m.status === "discarded" || m.status === "rejected"
      );
    }
    return candidateJobs;
  }, [candidateJobs, activeTab]);

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "interview":
        return <span className={`${styles.statusBadge} ${styles.statusInterview}`}>🎯 Entrevista Agendada</span>;
      case "applied":
        return <span className={`${styles.statusBadge} ${styles.statusApplied}`}>📨 Candidatura Enviada</span>;
      case "viewed":
        return <span className={`${styles.statusBadge} ${styles.statusViewed}`}>👀 Visualizada</span>;
      case "discarded":
      case "rejected":
        return <span className={`${styles.statusBadge} ${styles.statusDiscarded}`}>✕ Descartada</span>;
      default:
        return <span className={styles.statusBadge}>Pendente</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Navbar */}
      <header className={styles.navbar}>
        <Logo size={42} showTagline={true} taglineText="Carreiras & Match IA" asLink={true} />
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={styles.navLink}>
            Vagas
          </Link>
          <Link
            to="/candidaturas"
            className={`${styles.navLink} ${styles.activeLink}`}
          >
            Minhas Candidaturas
          </Link>
          {isLoggedIn && (
            <div className={styles.userNavGroup}>
              <span className={styles.userNamePill}>
                👤 {user?.name?.split(" ")[0] || "Candidato"}
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

      {/* 2. Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Minhas Candidaturas</h1>
        <p className={styles.heroSubtitle}>
          Gerencie e acompanhe a evolução de todos os seus processos seletivos em tempo real com transparência total.
        </p>
      </section>

      {/* 3. Painel de KPIs */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📋 Total de Candidaturas</span>
          <span className={styles.kpiValue}>{totalApplied}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>⏳ Em Análise / Enviadas</span>
          <span className={`${styles.kpiValue} ${styles.kpiHighlight}`}>{inAnalysis}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🎉 Entrevistas Agendadas</span>
          <span className={`${styles.kpiValue} ${styles.kpiSuccess}`}>{inInterview}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>★ Média de Match IA</span>
          <span className={styles.kpiValue}>{avgScore > 0 ? `${avgScore}%` : "--"}</span>
        </div>
      </section>

      {/* 4. Abas de Filtro */}
      <section className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Todas ({candidateJobs.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "applied" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("applied")}
        >
          Enviadas ({inAnalysis})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "interview" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("interview")}
        >
          Entrevistas ({inInterview})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "discarded" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("discarded")}
        >
          Descartadas ({candidateJobs.filter((m) => m.status === "discarded" || m.status === "rejected").length})
        </button>
      </section>

      {/* 5. Listagem de Candidaturas ou Empty State */}
      <main>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.7)" }}>
            Carregando suas candidaturas...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h2 className={styles.emptyTitle}>Nenhuma candidatura neste filtro</h2>
            <p className={styles.emptyText}>
              Você não possui processos com o status selecionado. Explore as oportunidades disponíveis e candidate-se às melhores vagas com base no seu perfil!
            </p>
            <Link to="/home" className={styles.emptyCta}>
              Explorar Vagas Recomendadas ➔
            </Link>
          </div>
        ) : (
          <div className={styles.applicationsGrid}>
            {filteredJobs.map((match) => (
              <article key={match.id} className={styles.appCard}>
                <div>
                  <div className={styles.appHeader}>
                    <div className={styles.badgesGroup}>
                      <span className={styles.scoreBadge}>★ {match.score}% Match</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                        {match.job.source}
                      </span>
                    </div>
                    {getStatusBadge(match.status)}
                  </div>

                  <div className={styles.appBody} style={{ marginTop: "14px" }}>
                    <h3 className={styles.appTitle}>{match.job.title}</h3>
                    <div className={styles.appCompany}>
                      <span>🏢 {match.job.company}</span>
                    </div>
                    <div className={styles.appLocation}>
                      <span>📍 {match.job.location || "Remoto / Não informado"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Seletor de Status em Tempo Real */}
                  <div className={styles.statusControlRow}>
                    <span>Atualizar Etapa:</span>
                    <select
                      className={styles.statusSelect}
                      value={match.status}
                      onChange={(e) =>
                        handleUpdateStatus(match.id, e.target.value as MatchStatus)
                      }
                    >
                      <option value="applied">Candidatado</option>
                      <option value="interview">Entrevista</option>
                      <option value="discarded">Descartada</option>
                      <option value="new">Voltar para Vagas</option>
                    </select>
                  </div>

                  <div className={styles.appActions} style={{ marginTop: "12px" }}>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => setSelectedMatch(match)}
                    >
                      Ver Detalhes
                    </button>
                    <a
                      href={match.job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLinkBtn}
                    >
                      Acessar Vaga ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Detalhes Reutilizado */}
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

export default Candidaturas;
