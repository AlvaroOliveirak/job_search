import styles from "../styles/register.module.css";
import Button from "../components/button";

function Register() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Página de Registro</h1>
        <form action="post" className={styles.registerForm}>
          <label
            htmlFor="email"
            style={{ fontFamily: "monospace", fontSize: "23px" }}
          >
            E-mail:{" "}
          </label>
          <input
            type="email"
            placeholder="xxxxxxx@gmail.com"
            name="email"
            className={styles.input}
          />
          <label
            htmlFor="password"
            style={{ fontFamily: "monospace", fontSize: "23px" }}
          >
            Senha:{" "}
          </label>
          <input
            type="password"
            placeholder="********"
            name="password"
            className={styles.input}
          />
          <label
            htmlFor="confirm-password"
            style={{ fontFamily: "monospace", fontSize: "23px" }}
          >
            Confirmar Senha:{" "}
          </label>
          <input
            type="password"
            placeholder="********"
            name="confirm-password"
            className={styles.input}
          />
        </form>
        <Button target="/" Text="Registrar" className={styles.registerButton} />
      </main>
    </>
  );
}

export default Register;
