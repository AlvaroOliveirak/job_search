// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";

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

        <div className={styles.otherlogins}>
          <button
            type="button"
            className={styles.google}
            onClick={() => handleSocialLogin("Google")}
            title="Entrar com Google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className={styles.linkedin}
            onClick={() => handleSocialLogin("LinkedIn")}
            title="Entrar com LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            Linkedin
          </button>
        </div>

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
