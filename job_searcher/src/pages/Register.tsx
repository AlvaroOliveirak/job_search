// src/pages/Register.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/register.module.css";
import { ResumeUpload } from "../components";
import { useAuth } from "../hooks/useAuth";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleLogout = () => {
    logout();
    showToast("✓ Você encerrou sua sessão para criar um novo cadastro.");
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = "O nome completo é obrigatório.";
    } else if (name.trim().length < 3) {
      errs.name = "O nome deve conter ao menos 3 caracteres.";
    }

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

    if (!confirmPassword) {
      errs.confirmPassword = "Confirme sua senha.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "As senhas não coincidem.";
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
    setSuccessMessage("Cadastro realizado com sucesso! Conectando perfil...");

    setTimeout(() => {
      login(email, name);
      navigate("/home");
    }, 1200);
  };

  const handleSocialRegister = (provider: string) => {
    login(`usuario.${provider.toLowerCase()}@email.com`, `Usuário ${provider}`);
    navigate("/home");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Área à esquerda: Apelo & Proposta de Valor */}
      <div className={styles.appealsection}>
        <div className={styles.maintitle}>
          <h1 className={styles.title}>Job Search</h1>
          <h2 className={styles.subtitle}>
            Dê o <strong>próximo passo</strong> <br />
            na sua carreira
          </h2>
          <p>
            Conectamos você com empresas de tecnologia que buscam exatamente
            suas qualificações
          </p>
        </div>

        <div className={styles.appeal}>⚡ Candidatura rápida</div>
        <p className={styles.appeal1}>
          ° Envie seu currículo diretamente, sem formulários exaustivos
        </p>

        <div className={styles.appeal}>🎯 Match Inteligente</div>
        <p className={styles.appeal2}>
          ° Análise automatizada do currículo para encontrar vagas sob medida
        </p>

        <div className={styles.appeal}>🚀 Conexão Direta</div>
        <p className={styles.appeal3}>
          ° Acesso a empresas de ponta com processos ágeis e feedbacks rápidos
        </p>
      </div>

      {/* Área à direita: Sessão Ativa OU Card de Formulário Controlado */}
      {isLoggedIn ? (
        <main className={styles.sessionCard}>
          <div className={styles.sessionAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className={styles.sessionTag}>✦ CONECTADO</span>
          <h1 className={styles.sessionTitle}>Conta Já Conectada</h1>
          <p className={styles.sessionInfo}>
            Você já possui uma sessão ativa como{" "}
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
              Ir para as Vagas ➔
            </button>
            <button
              type="button"
              className={styles.sessionLogoutBtn}
              onClick={handleLogout}
              title="Desconectar para registrar uma nova conta"
            >
              🚪 Desconectar para Novo Cadastro
            </button>
          </div>

          <div style={{ marginTop: "12px", fontFamily: "monospace", fontSize: "14px" }}>
            <Link to="/" style={{ color: "rgb(83, 145, 199)", textDecoration: "none" }}>
              ← Voltar à Página Inicial
            </Link>
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.cardtitle}>Cadastre-se</h1>
          <p>
            Já possui uma conta?<Link to="/login"> Entre</Link>
          </p>

        {/* Mensagens de Sucesso e Erro Geral (Requisito 8: Mensagens condicionais) */}
        {successMessage && (
          <div className={styles.successAlert}>
            ✓ {successMessage}
          </div>
        )}

        {Object.keys(errors).length > 0 && !successMessage && (
          <div className={styles.generalErrorAlert}>
            ⚠️ Por favor, corrija os erros apontados no formulário.
          </div>
        )}

        <div className={styles.otherlogins}>
          <button
            type="button"
            className={styles.google}
            onClick={() => handleSocialRegister("Google")}
            title="Cadastrar com Google"
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
            onClick={() => handleSocialRegister("LinkedIn")}
            title="Cadastrar com LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            Linkedin
          </button>
        </div>

        {/* Formulário Controlado (Requisito 5 da AV1) */}
        <form onSubmit={handleSubmit} className={styles.registerForm} noValidate>
          {/* Nome Completo */}
          <label htmlFor="name" className={styles.label}>
            Nome Completo *
          </label>
          <input
            id="name"
            type="text"
            placeholder="ex: Douglas Costa"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={styles.input}
            style={{ borderColor: errors.name ? "#ef4444" : undefined }}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}

          {/* E-mail */}
          <label htmlFor="email" className={styles.label}>
            E-mail: *
          </label>
          <input
            id="email"
            type="email"
            placeholder="xxxxxxx@gmail.com"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={styles.input}
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}

          {/* Senha */}
          <label htmlFor="password" className={styles.label}>
            Senha: *
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className={styles.input}
            style={{ borderColor: errors.password ? "#ef4444" : undefined }}
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

          {/* Confirmar Senha */}
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Senha: *
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repita sua senha"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            className={styles.input}
            style={{ borderColor: errors.confirmPassword ? "#ef4444" : undefined }}
          />
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>{errors.confirmPassword}</span>
          )}

          {/* Campo de Upload de Currículo Reutilizável */}
          <ResumeUpload
            fileName={fileName}
            onFileSelect={(file) => setFileName(file.name)}
            label="Currículo (Opcional):"
            className={styles.uploadField}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.registerButton}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
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

export default Register;
