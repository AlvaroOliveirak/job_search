// src/components/Footer.tsx
import styles from "../styles/footer.module.css";

export type FooterProps = {
  className?: string;
};

function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <h3>Job Search</h3>
          <p>Conectando talentos e oportunidades em todo o país.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#privacidade" className={styles.footerLink}>
            Privacidade
          </a>
          <a href="#termos" className={styles.footerLink}>
            Termos de Uso
          </a>
          <a href="#contato" className={styles.footerLink}>
            Contato
          </a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {currentYear} Job Search. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
