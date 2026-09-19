// src/pages/Init.tsx
import styles from "../styles/init.module.css";
import Button from "../components/button";

function Init() {
  return (
    <>
      <div>
        <h1 className={styles.title}>Job Search</h1>
      </div>
      <div className={styles.aside}>
        <h1>Encontre Vagas Rápido</h1>
        <div className={styles.imagecontainer}></div>
      </div>
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Features:</h2>
        <div className={styles.container}>
          <div className={styles.card}>Cadastre seu Curriculo</div>
          <div className={styles.card}>Procure vagas</div>
          <div className={styles.card}>Entre em contato</div>
        </div>
        <Button
          target="/Register"
          Text="Começar Agora"
          className={styles.enterButton}
        />
      </section>
      <footer className={styles.footer}>
        <p>© 2026 Job Search. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default Init;
