import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components";
import { profileService } from "../services/profileService";
import { searchSkills, type SkillItem } from "../data/skillsCatalog";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/perfil.module.css";

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Java",
  "Spring Boot",
  "Python",
  "Node.js",
  "Docker",
  "SQL",
  "PostgreSQL",
  "AWS",
  "Git",
  "Next.js",
  "Tailwind CSS",
  "REST",
];

export function Perfil() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados do Perfil
  const [profileName, setProfileName] = useState<string>("Desenvolvedor Full Stack");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(70);
  const [telegramChatId, setTelegramChatId] = useState<string>("123456789");

  // Estados do Autocomplete de Skills (Estilo LinkedIn)
  const [suggestions, setSuggestions] = useState<SkillItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fecha o dropdown de autocomplete ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manipulador de digitação com busca em tempo real no catálogo de TI
  const handleSkillInputChange = (value: string) => {
    setNewSkill(value);
    if (value.trim().length >= 1) {
      const results = searchSkills(value, skills, 7);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Navegação por teclado no dropdown (Setas e Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleAddSkill(suggestions[highlightedIndex].name);
        } else if (suggestions[0] && suggestions[0].name.toLowerCase() === newSkill.trim().toLowerCase()) {
          handleAddSkill(suggestions[0].name);
        } else {
          handleAddSkill(newSkill);
        }
        setShowDropdown(false);
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(newSkill);
      setShowDropdown(false);
    }
  };

  // Carrega o perfil ativo do usuário da API
  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await profileService.getActiveProfile();
        if (isActive && data) {
          setProfileName(data.name || "Desenvolvedor Full Stack");
          setMinScore(data.min_score || 70);

          if (data.keywords) {
            const parsedSkills = data.keywords
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
            setSkills(parsedSkills);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isActive = false;
    };
  }, []);

  // Adicionar nova skill
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;

    const alreadyExists = skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      showToast(`⚠️ A habilidade "${trimmed}" já está na sua lista.`);
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  // Remover skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Salvar perfil e recalcular aderência
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (skills.length === 0) {
      showToast("⚠️ Adicione ao menos uma habilidade técnica ao seu perfil.");
      return;
    }

    setSaving(true);
    try {
      const keywordsString = skills.join(", ");
      await profileService.updateActiveProfile({
        name: profileName.trim() || "Meu Perfil",
        keywords: keywordsString,
        minScore,
      });

      showToast("✨ Perfil atualizado com sucesso! Aderência das vagas recalculada.");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      showToast("⚠️ Falha ao salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Barra de Navegação */}
      <header className={styles.navbar}>
        <Logo size={42} showTagline={true} taglineText="Carreiras & Match IA" asLink={true} />
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={styles.navLink}>
            Vagas
          </Link>
          <Link to="/candidaturas" className={styles.navLink}>
            Minhas Candidaturas
          </Link>
          <Link to="/perfil" className={`${styles.navLink} ${styles.activeLink}`}>
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
        <h1 className={styles.heroTitle}>Meu Perfil & Habilidades</h1>
        <p className={styles.heroSubtitle}>
          Personalize suas competências e critérios de busca. O motor de inteligência artificial
          recalculará a compatibilidade das vagas em tempo real para o seu perfil.
        </p>
      </section>

      {/* Formulário Principal */}
      <main>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className={styles.spinIcon} style={{ fontSize: "36px" }}>🔄</div>
            <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.7)" }}>
              Carregando suas preferências de carreira...
            </p>
          </div>
        ) : (
          <form className={styles.formCard} onSubmit={handleSubmit}>
            {/* Seção 1: Dados do Candidato & Cargo */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span style={{ fontSize: "20px" }}>👤</span>
                <h2 className={styles.sectionTitle}>Identificação Profissional</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Nome Completo:</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.inputReadOnly}`}
                    value={user?.name || "Álvaro Oliveira"}
                    readOnly
                    title="Nome cadastrado na sua conta"
                  />
                  <span className={styles.hint}>Vinculado ao seu usuário cadastrado.</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>E-mail:</label>
                  <input
                    type="email"
                    className={`${styles.input} ${styles.inputReadOnly}`}
                    value={user?.email || "alvarooliver1802@gmail.com"}
                    readOnly
                    title="E-mail de acesso"
                  />
                  <span className={styles.hint}>Usado para autenticação segura.</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Cargo Alvo ou Título Profissional:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ex: Desenvolvedor Front-End Sênior, Engenheiro Java Pleno..."
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                <span className={styles.hint}>
                  Define o título do seu perfil de busca nas recomendações.
                </span>
              </div>
            </div>

            {/* Seção 2: Minhas Habilidades Técnicas (Skills) */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span style={{ fontSize: "20px" }}>⚡</span>
                <h2 className={styles.sectionTitle}>Habilidades Técnicas & Tecnologias</h2>
              </div>

              <p className={styles.hint} style={{ margin: 0 }}>
                Adicione as linguagens, frameworks e ferramentas que você domina. O motor de IA utiliza
                essas palavras-chave para ranquear as vagas e buscar novas oportunidades na Gupy.
              </p>

              {/* Input com Autocomplete inteligente para nova skill */}
              <div className={styles.skillsInputRow} ref={dropdownRef}>
                <div className={styles.autocompleteWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Comece a digitar uma habilidade (ex: React, Java, Docker, PostgreSQL)..."
                    value={newSkill}
                    onChange={(e) => handleSkillInputChange(e.target.value)}
                    onFocus={() => {
                      if (newSkill.trim().length >= 1) {
                        const results = searchSkills(newSkill, skills, 7);
                        setSuggestions(results);
                        setShowDropdown(results.length > 0);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />

                  {/* Dropdown Flutuante de Sugestões Padronizadas de TI */}
                  {showDropdown && suggestions.length > 0 && (
                    <ul className={styles.suggestionsDropdown}>
                      {suggestions.map((item, index) => (
                        <li
                          key={item.name}
                          className={`${styles.suggestionItem} ${
                            highlightedIndex === index ? styles.suggestionItemActive : ""
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleAddSkill(item.name);
                            setShowDropdown(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <span className={styles.suggestionName}>
                            🔍 {item.name}
                          </span>
                          <span className={styles.suggestionCategory}>
                            {item.category}
                          </span>
                        </li>
                      ))}
                      <div className={styles.dropdownFooter}>
                        <span>Dica: Use as setas ↑ ↓ e Enter para escolher</span>
                        <span>{suggestions.length} sugestões</span>
                      </div>
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.addSkillBtn}
                  onClick={() => {
                    handleAddSkill(newSkill);
                    setShowDropdown(false);
                  }}
                >
                  + Adicionar
                </button>
              </div>

              {/* Container de Chips/Tags */}
              <div className={styles.tagsContainer}>
                {skills.length === 0 ? (
                  <span className={styles.emptyTagsText}>
                    Nenhuma habilidade adicionada ainda. Digite acima ou selecione as sugestões rápidas abaixo.
                  </span>
                ) : (
                  skills.map((skill) => (
                    <span key={skill} className={styles.skillChip}>
                      <span>{skill}</span>
                      <button
                        type="button"
                        className={styles.removeChipBtn}
                        onClick={() => handleRemoveSkill(skill)}
                        title={`Remover ${skill}`}
                        aria-label={`Remover habilidade ${skill}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Sugestões Rápidas */}
              <div className={styles.suggestionsBox}>
                <span className={styles.suggestionsTitle}>💡 Sugestões Rápidas de Tecnologia:</span>
                <div className={styles.suggestionsList}>
                  {POPULAR_SKILLS.map((popSkill) => {
                    const isAdded = skills.some(
                      (s) => s.toLowerCase() === popSkill.toLowerCase()
                    );
                    return (
                      <button
                        key={popSkill}
                        type="button"
                        className={styles.suggestionBadge}
                        style={
                          isAdded
                            ? { opacity: 0.4, cursor: "not-allowed", textDecoration: "line-through" }
                            : {}
                        }
                        onClick={() => !isAdded && handleAddSkill(popSkill)}
                        disabled={isAdded}
                      >
                        {isAdded ? `✓ ${popSkill}` : `+ ${popSkill}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Seção 3: Parâmetros de Matching e Alertas */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span style={{ fontSize: "20px" }}>🎯</span>
                <h2 className={styles.sectionTitle}>Preferências de Notificação e Compatibilidade</h2>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Nota Mínima de Compatibilidade para Alertas:
                </label>
                <div className={styles.scoreRangeWrapper}>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="5"
                    className={styles.rangeInput}
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                  />
                  <span className={styles.scoreBadgeValue}>
                    {minScore}%
                  </span>
                </div>
                <span className={styles.hint}>
                  Avisar e priorizar vagas que apresentarem aderência igual ou superior a {minScore}%.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Telegram Chat ID para Alertas Imediatos:
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ex: 123456789"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                />
                <span className={styles.hint}>
                  O robô de IA enviará mensagens instantâneas no seu Telegram ao encontrar vagas com alto match.
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className={styles.formActions}>
              <Link to="/home" className={styles.viewJobsBtn}>
                🔍 Ver Minhas Vagas
              </Link>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className={styles.spinIcon}>🔄</span>
                    <span>Salvando e recalculando...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Salvar Perfil e Atualizar Vagas</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Perfil;
