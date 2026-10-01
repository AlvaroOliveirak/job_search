// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { useAuth } from "../hooks/useAuth";

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout } = useAuth();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleLogout = () => {
    logout();
    showToast("✓ Você encerrou sua sessão com sucesso.");
  };

  const validate = (): boolean => {
    const errs: LoginFormErrors = {};

    if (!email.trim()) {
      errs.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Informe um formato de e-mail válido (ex: seu@email.com).";
    }

    if (!password) {
      errs.password = "A senha é obrigatória.";
    } else if (password.length < 6) {
      errs.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    login(email.trim());
    navigate("/home");
  };

  const handleSocialLogin = (provider: string) => {
    login(`candidato.${provider.toLowerCase()}@email.com`, `Candidato (${provider})`);
    navigate("/home");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Área à esquerda: Apelo & Boas-vindas */}
      <div className={styles.appealsection}>
        <div className={styles.maintitle}>
          <h1 className={styles.title}>Job Search</h1>
          <h2 className={styles.subtitle}>
            Bem-vindo de volta! <br />
            Dê o <strong>próximo passo</strong> na sua carreira
          </h2>
          <p>
            Acesse sua conta para conferir novas oportunidades que dão match com
            o seu perfil profissional.
          </p>
        </div>

        <div className={styles.appeal}>⚡ Matchs Atualizados</div>
        <p className={styles.appeal1}>
          ° Novas vagas recomendadas diariamente com base nas suas qualificações
        </p>

        <div className={styles.appeal}>🎯 Status em Tempo Real</div>
        <p className={styles.appeal2}>
          ° Acompanhe o retorno das empresas e as etapas do seu processo
        </p>

        <div className={styles.appeal}>🔒 Acesso Seguro & Privativo</div>
        <p className={styles.appeal3}>
          ° Suas informações e pretensões profissionais protegidas com segurança
        </p>
      </div>

      {/* Área à direita: Sessão Ativa OU Card de Login */}
      {isLoggedIn ? (
        <main className={styles.sessionCard}>
          <div className={styles.sessionAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className={styles.sessionTag}>✦ CONECTADO</span>
          <h1 className={styles.sessionTitle}>Sessão Ativa</h1>
          <p className={styles.sessionInfo}>
            Você já está autenticado no Job Search como{" "}
            <strong>{user?.name || "Candidato"}</strong>
            <br />
            <span className={styles.sessionEmail}>{user?.email}</span>
          </p>

          <div className={styles.sessionActions}>
            <button
              type="button"
              className={styles.sessionPrimaryBtn}
              onClick={() => navigate("/home")}
            >
              Explorar Vagas ➔
            </button>
            <button
              type="button"
              className={styles.sessionLogoutBtn}
              onClick={handleLogout}
              title="Encerrar a sessão atual"
            >
              🚪 Sair da Conta (Logout)
            </button>
          </div>

          <div className={styles.backHome}>
            <Link to="/" className={styles.backHomeLink}>
              ← Voltar à Página Inicial
            </Link>
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.cardtitle}>Entrar</h1>
        <p>
          Não possui uma conta? <Link to="/Register">Cadastre-se</Link>
        </p>


        <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
          {/* Mensagem de Erro Geral */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.generalErrorAlert}>
              ⚠️ Por favor, preencha os campos obrigatórios corretamente.
            </div>
          )}

          {/* E-mail */}
          <label htmlFor="email" className={styles.label}>
            E-mail:
          </label>
          <input
            id="email"
            type="email"
            placeholder="xxxxxxx@gmail.com"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            className={styles.input}
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
            required
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}

          {/* Senha */}
          <label htmlFor="password" className={styles.label}>
            Senha:
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            className={styles.input}
            style={{ borderColor: errors.password ? "#ef4444" : undefined }}
            required
          />
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password}</span>
          )}

          {/* Opções: Lembrar de mim e Esqueci a senha */}
          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar de mim
            </label>
            <a href="#recuperar" className={styles.forgotLink}>
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.backHome}>
          <Link to="/" className={styles.backHomeLink}>
            ← Voltar ao Início
          </Link>
        </div>
      </main>
      )}

      {/* Toast de feedback de ação */}
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Login;
