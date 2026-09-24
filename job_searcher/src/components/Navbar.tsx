// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import styles from "../styles/navbar.module.css";
import Button from "./button";

export type NavbarProps = {
  activePage?: "home" | "applications" | "salaries" | "companies";
  userName?: string;
  avatarLetter?: string;
};

function Navbar({
  activePage = "home",
  userName = "Álvaro O.",
  avatarLetter = "A",
}: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navBrand} title="Ir para início">
        <h1 className={styles.brandLogo}>Job Search</h1>
      </Link>

      <div className={styles.navLinks}>
        <Link
          to="/"
          className={`${styles.navLink} ${
            activePage === "home" ? styles.navLinkActive : ""
          }`}
        >
          Início
        </Link>
        <a href="#candidaturas" className={styles.navLink}>
          Minhas Candidaturas
        </a>
        <a href="#salarios" className={styles.navLink}>
          Salários
        </a>
        <a href="#empresas" className={styles.navLink}>
          Empresas
        </a>
      </div>

      <div className={styles.navUser}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{avatarLetter}</div>
          <span className={styles.userName}>{userName}</span>
        </div>
        <Button target="/" className={styles.logoutBtn}>
          Sair
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
