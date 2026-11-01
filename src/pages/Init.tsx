// src/pages/Init.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/init.module.css";
import { Footer } from "../components";
import { useAuth } from "../hooks/useAuth";

function Init() {
  const { isLoggedIn, user, logout } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleLogout = () => {
    logout();
    showToast("✓ Você encerrou sua sessão com sucesso!");
  };

  return (
    <>
      {/* 1. Header Bar */}
      <header className={styles.headerBar}>
        <div className={styles.brandWrapper}>
          <div className={styles.logoBadge} title="Job Search - Conectando Carreiras">
            <svg
              width="44"
              height="44"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logoSvg}
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <rect
                x="3"
                y="3"
                width="42"
                height="42"
                rx="12"
                fill="rgba(20, 27, 45, 0.95)"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
              />
              <path
                d="M17 17C17 14.7909 18.7909 13 21 13H27C29.2091 13 31 14.7909 31 17V19H17V17Z"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="11"
                y="19"
                width="26"
                height="18"
                rx="4"
                fill="rgba(56, 189, 248, 0.12)"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
              />
              <circle cx="23" cy="27" r="4.5" stroke="#38bdf8" strokeWidth="1.8" />
              <circle cx="23" cy="27" r="1.5" fill="#818cf8" />
              <path
                d="M26.2 30.2L30 34"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 28H18.5M27.5 28H36"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1.5 2"
              />
            </svg>
          </div>

          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              Job <span className={styles.titleHighlight}>Search</span>
            </h1>
            <span className={styles.titleTagline}>Plataforma de Carreiras & Match IA</span>
          </div>
        </div>

        {isLoggedIn ? (
          <div className={styles.headerActions}>
            <Link to="/home" className={styles.headerNavLink}>
              Vagas
            </Link>
            <Link to="/candidaturas" className={styles.headerNavLink}>
              Minhas Candidaturas
            </Link>
            <Link to="/perfil" className={styles.headerNavLink}>
              Meu Perfil
            </Link>
            <div
              className={styles.userBadge}
              title={`Conectado como ${user?.email || "Candidato"}`}
            >
              <span className={styles.userAvatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
              <span>Olá, {user?.name?.split(" ")[0] || "Candidato"}</span>
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
              title="Encerrar sessão"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className={styles.headerActions}>
            <Link to="/login" className={styles.headerLoginBtn}>
              Entrar
            </Link>
            <Link to="/Register" className={styles.headerCta}>
              Cadastrar-se ➔
            </Link>
          </div>
        )}
      </header>

      {/* Banner de Boas-vindas para Usuário Logado */}
      {isLoggedIn && (
        <div className={styles.loggedInBanner}>
          <span className={styles.welcomeTag}>✦ SESSÃO ATIVA</span>
          <h2 className={styles.loggedInTitle}>
            Bem-vindo de volta, {user?.name || "Candidato"}!
          </h2>
          <p className={styles.loggedInText}>
            Seu perfil está sincronizado com o motor de compatibilidade IA.
            Acompanhe o andamento dos seus processos seletivos ou descubra novas vagas abertas hoje.
          </p>
          <div className={styles.quickActions}>
            <Link to="/home" className={styles.primaryActionBtn}>
              Explorar Vagas Recomendadas ➔
            </Link>
            <Link to="/candidaturas" className={styles.secondaryActionBtn}>
              Ver Minhas Candidaturas ➔
            </Link>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>
          <span className={styles.heroTagDot} />
          <span>VAGAS EM TECNOLOGIA & TRIAGEM INTELIGENTE</span>
        </div>

        <h1 className={styles.mainTitle}>
          Encontre as vagas mais adequadas para você,{" "}
          <span className={styles.mainTitleHighlight}>sem perder tempo com processos cegos.</span>
        </h1>

        <p className={styles.heroDescription}>
          Conectamos profissionais qualificados às empresas mais inovadoras do mercado com análise automatizada de currículo, pretensão salarial clara e feedback ágil.
        </p>

        <div className={styles.ctaGroup}>
          {isLoggedIn ? (
            <>
              <Link to="/home" className={styles.ctaButton}>
                Explorar Vagas Recomendadas ➔
              </Link>
              <Link to="/candidaturas" className={styles.heroSecondaryBtn}>
                Acompanhar Candidaturas
              </Link>
            </>
          ) : (
            <>
              <Link to="/Register" className={styles.ctaButton}>
                Cadastrar Perfil Grátis ➔
              </Link>
              <Link to="/home" className={styles.heroSecondaryBtn}>
                Explorar Vagas Abertas
              </Link>
            </>
          )}
        </div>

        {/* Faixa de Métricas */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>+5.000</span>
            <span className={styles.metricLabel}>Vagas ativas no Brasil & Remotas</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>+800</span>
            <span className={styles.metricLabel}>Empresas parceiras conectadas</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>48h</span>
            <span className={styles.metricLabel}>Tempo médio de retorno das etapas</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>100%</span>
            <span className={styles.metricLabel}>Gratuito para candidatos sempre</span>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona (3 Passos) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>✦ PASSO A PASSO</span>
          <h2 className={styles.sectionTitle}>Como Funciona o Job Search</h2>
          <p className={styles.sectionSubtitle}>
            Três passos objetivos para acelerar a sua recolocação profissional.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>PASSO 01</span>
            <h3 className={styles.stepTitle}>Cadastre seu Perfil & Skills</h3>
            <p className={styles.stepDescription}>
              Defina suas principais competências técnicas, pretensão salarial e objetivos profissionais em menos de 2 minutos.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>PASSO 02</span>
            <h3 className={styles.stepTitle}>Match Automatizado por IA</h3>
            <p className={styles.stepDescription}>
              Nosso algoritmo analisa seu currículo contra milhares de oportunidades e ranqueia as vagas com maior aderência ao seu perfil.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>PASSO 03</span>
            <h3 className={styles.stepTitle}>Candidatura & Feedback Ágil</h3>
            <p className={styles.stepDescription}>
              Candidate-se diretamente às vagas selecionadas e acompanhe cada etapa do processo com total clareza e previsibilidade.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Categorias em Alta */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>✦ EXPLORE POR ÁREA</span>
          <h2 className={styles.sectionTitle}>Categorias em Alta no Mercado</h2>
          <p className={styles.sectionSubtitle}>
            Oportunidades com maior volume de contratações e salários competitivos.
          </p>
        </div>

        <div className={styles.categoriesGrid}>
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>💻</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>Desenvolvimento & Software</h4>
              <span className={styles.categoryCount}>+2.400 vagas abertas</span>
            </div>
          </div>

          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>🎨</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>Design & UX/UI</h4>
              <span className={styles.categoryCount}>+650 vagas abertas</span>
            </div>
          </div>

          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>📊</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>Dados & Inteligência Artificial</h4>
              <span className={styles.categoryCount}>+920 vagas abertas</span>
            </div>
          </div>

          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>📢</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>Marketing & Growth</h4>
              <span className={styles.categoryCount}>+1.100 vagas abertas</span>
            </div>
          </div>

          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>🛡️</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>DevOps & Cibersegurança</h4>
              <span className={styles.categoryCount}>+480 vagas abertas</span>
            </div>
          </div>

          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>🌍</div>
            <div className={styles.categoryInfo}>
              <h4 className={styles.categoryTitle}>Vagas 100% Remotas</h4>
              <span className={styles.categoryCount}>+1.850 vagas abertas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Por que o Job Search */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>✦ DIFERENCIAIS</span>
          <h2 className={styles.sectionTitle}>Por que Escolher o Job Search?</h2>
          <p className={styles.sectionSubtitle}>
            Desenvolvido para eliminar processos cansativos e dar visibilidade real às suas candidaturas.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <h3 className={styles.benefitTitle}>Feedbacks Rápidos</h3>
            <p className={styles.benefitDescription}>
              Chega de ficar no escuro. Acompanhe a evolução do status de cada candidatura em tempo real.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💸</div>
            <h3 className={styles.benefitTitle}>Salários Transparentes</h3>
            <p className={styles.benefitDescription}>
              Vagas com faixas salariais claras desde a triagem, poupando seu tempo em entrevistas desajustadas.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔒</div>
            <h3 className={styles.benefitTitle}>Privacidade Total</h3>
            <p className={styles.benefitDescription}>
              Você decide a visibilidade do seu perfil perante as empresas com controle absoluto sobre seus dados.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🆓</div>
            <h3 className={styles.benefitTitle}>100% Gratuito</h3>
            <p className={styles.benefitDescription}>
              Sem planos premium, taxas ocultas ou paywalls para ter acesso a oportunidades e entrevistas.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>✦ DÚVIDAS FREQUENTES</span>
          <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
          <p className={styles.sectionSubtitle}>
            Tudo o que você precisa saber antes de iniciar suas candidaturas.
          </p>
        </div>

        <div className={styles.faqGrid}>
          <div className={styles.faqCard}>
            <h4 className={styles.faqQuestion}>O cadastro é realmente gratuito?</h4>
            <p className={styles.faqAnswer}>
              Sim! Para candidatos, o acesso à plataforma, busca de vagas, cálculo de match e candidaturas são e sempre serão 100% gratuitos.
            </p>
          </div>

          <div className={styles.faqCard}>
            <h4 className={styles.faqQuestion}>Tem vagas para iniciantes, Júnior ou Estágio?</h4>
            <p className={styles.faqAnswer}>
              Com certeza! Contamos com filtros específicos para quem busca o primeiro emprego, estágio técnico ou posições de nível Júnior e Trainee.
            </p>
          </div>

          <div className={styles.faqCard}>
            <h4 className={styles.faqQuestion}>Como as empresas entram em contato comigo?</h4>
            <p className={styles.faqAnswer}>
              Assim que uma empresa demonstrar interesse no seu perfil, ela atualizará o status no painel e enviará convite diretamente ao seu e-mail cadastrado.
            </p>
          </div>

          <div className={styles.faqCard}>
            <h4 className={styles.faqQuestion}>Como funciona para vagas internacionais e remotas?</h4>
            <p className={styles.faqAnswer}>
              Você pode filtrar posições 100% remotas de empresas de tecnologia de todo o Brasil e do exterior sem restrições de localidade.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA Final Boxed */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <span className={styles.ctaTag}>✦ ACELERE SUA CARREIRA</span>

          {isLoggedIn ? (
            <>
              <h2 className={styles.ctaTitle}>Continue impulsionando a sua trajetória profissional</h2>
              <p className={styles.ctaSubtitle}>
                Novas oportunidades compatíveis com suas competências técnicas chegam todos os dias.
              </p>
              <div className={styles.ctaActions}>
                <Link to="/home" className={styles.ctaButton}>
                  Explorar Vagas Agora ➔
                </Link>
                <Link to="/candidaturas" className={styles.heroSecondaryBtn}>
                  Minhas Candidaturas
                </Link>
                <Link to="/perfil" className={styles.heroSecondaryBtn}>
                  Editar Perfil & Skills
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.ctaTitle}>Pronto para dar o próximo passo na sua carreira?</h2>
              <p className={styles.ctaSubtitle}>
                Cadastre-se gratuitamente agora mesmo e receba recomendações assertivas alinhadas às suas ambições.
              </p>
              <div className={styles.ctaActions}>
                <Link to="/Register" className={styles.ctaButton}>
                  Criar Conta Gratuita ➔
                </Link>
                <Link to="/home" className={styles.heroSecondaryBtn}>
                  Ver Vagas Abertas
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 8. Rodapé Reutilizável */}
      <Footer />

      {/* Toast de feedback */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default Init;
