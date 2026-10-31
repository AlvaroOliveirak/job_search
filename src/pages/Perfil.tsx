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
      showToast(`A habilidade "${trimmed}" já está adicionada.`);
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Remover skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Salvar perfil e acionar recálculo
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (skills.length === 0) {
      showToast("Adicione pelo menos 1 habilidade para calibrar o match de vagas.");
      return;
    }

    setSaving(true);
    try {
      const keywordsString = skills.join(", ");
      await profileService.updateActiveProfile({
        name: profileName,
        keywords: keywordsString,
        minScore,
      });

      showToast("🎉 Perfil de habilidades atualizado e aderência de vagas recalculada!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      showToast("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Navbar */}
      <header className={styles.navbar}>
        <Logo size={42} showTagline={true} taglineText="Perfil & Skills" asLink={true} />
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/home" className={styles.navLink}>
            Vagas
          </Link>
          <Link to="/candidaturas" className={styles.navLink}>
            Candidaturas
          </Link>
          <Link to="/perfil" className={`${styles.navLink} ${styles.activeLink}`}>
            Perfil
          </Link>
          {isLoggedIn ? (
            <div className={styles.userNavGroup}>
              <span className={styles.userNamePill}>
                👤 {user?.name || user?.email?.split("@")[0] || "Alvaro Oliver"}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Encerrar sessão">
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

      {/* 2. Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Perfil Profissional & Habilidades</h1>
        <p className={styles.heroSubtitle}>
          Defina suas competências técnicas e linguagens para calibrar o algoritmo de Inteligência
          Artificial e receber vagas personalizadas diretamente da Gupy.
        </p>
      </section>

      {/* 3. Conteúdo Principal */}
      <main>
        {loading ? (
          <div className={styles.formCard} style={{ alignItems: "center", padding: "60px" }}>
            <span className={styles.spinIcon} style={{ fontSize: "32px", color: "#38bdf8" }}>
              🔄
            </span>
            <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.7)" }}>
              Carregando seu perfil técnico...
            </p>
          </div>
        ) : (
          <form className={styles.formCard} onSubmit={handleSubmit}>
            {/* Seção 1: Dados do Candidato */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span style={{ fontSize: "20px" }}>👤</span>
                <h2 className={styles.sectionTitle}>Identificação do Candidato</h2>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nome do Cargo Alvo / Título do Perfil:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ex: Desenvolvedor Front-End React / Full Stack"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                <span className={styles.hint}>
                  Utilizado para categorizar suas preferências e alertas de vagas.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>E-mail da Conta:</label>
                <input
                  type="email"
                  className={`${styles.input} ${styles.inputReadOnly}`}
                  value={user?.email || "alvarooliver1802@gmail.com"}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* Seção 2: Habilidades com Autocomplete estilo LinkedIn */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span style={{ fontSize: "20px" }}>⚡</span>
                <h2 className={styles.sectionTitle}>
                  Habilidades & Competências de TI (Foco da IA)
                </h2>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Adicionar Tecnologias (digite para buscar no catálogo):
                </label>

                <div className={styles.skillsInputRow}>
                  <div className={styles.autocompleteWrapper} ref={dropdownRef}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Ex: React, TypeScript, Spring Boot, Docker, Python..."
                      value={newSkill}
                      onChange={(e) => handleSkillInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (newSkill.trim().length >= 1) {
                          setShowDropdown(true);
                        }
                      }}
                    />

                    {/* Dropdown de Autocomplete Estilo LinkedIn */}
                    {showDropdown && suggestions.length > 0 && (
                      <ul className={styles.suggestionsDropdown}>
                        {suggestions.map((item, idx) => (
                          <li
                            key={item.name}
                            className={`${styles.suggestionItem} ${
                              idx === highlightedIndex ? styles.suggestionItemActive : ""
                            }`}
                            onClick={() => {
                              handleAddSkill(item.name);
                              setShowDropdown(false);
                            }}
                          >
                            <span className={styles.suggestionName}>{item.name}</span>
                            <span className={styles.suggestionCategory}>{item.category}</span>
                          </li>
                        ))}
                        <li className={styles.dropdownFooter}>
                          <span>💡 Pressione Enter para adicionar</span>
                          <span>{suggestions.length} sugestões</span>
                        </li>
                      </ul>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.addSkillBtn}
                    onClick={() => handleAddSkill(newSkill)}
                  >
                    + Adicionar
                  </button>
                </div>
                <span className={styles.hint}>
                  O algoritmo de IA compara essas tecnologias com os requisitos das vagas para calcular a aderência.
                </span>
              </div>

              {/* Tags Ativas */}
              <div className={styles.tagsContainer}>
                {skills.length === 0 ? (
                  <span className={styles.emptyTagsText}>
                    Nenhuma habilidade cadastrada ainda. Digite acima ou selecione as sugestões rápidas abaixo.
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
