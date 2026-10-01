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
