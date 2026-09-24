// src/pages/Register.tsx
import { useState } from "react";
import styles from "../styles/register.module.css";
import { Button, ResumeUpload } from "../components";

function Register() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className={styles.pageContainer}>
      {/*Área à esquerda */}
      <div className={styles.appealsection}>
        <div className={styles.maintitle}>
          <h1 className={styles.title}>Job Search</h1>
          <h2 className={styles.subtitl}>Dê o próixmo passo na sua carreira</h2>
          <p>
            Encontre rapidamente vagas que se alinhem melhor com suas
            habilidades
          </p>
        </div>

        <div className={styles.appeal}> Candidatura rápida</div>
        <p className={styles.appeal1}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus ad
          sapiente odio consequatur. Quas nihil repellendus aspernatur
          architecto, vitae optio non, soluta incidunt, blanditiis dolores culpa
          enim id repudiandae? Laboriosam.
        </p>
        <div className={styles.appeal}></div>
        <p className={styles.appeal2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
          optio excepturi sit facilis vel aspernatur molestiae illo cumque in
          obcaecati ut explicabo soluta voluptatum dolorem, deleniti itaque
          eveniet ipsum vero.
        </p>
        <div className={styles.appeal}></div>
        <p className={styles.appeal3}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat ipsa
          minima, iste tempora accusamus similique debitis qui pariatur iusto.
          Voluptatum quae minima quidem obcaecati tempore dolorem explicabo
          quibusdam perspiciatis porro.
        </p>
      </div>

      {/*Área à direita */}
      <main className={styles.main}>
        <h1 className={styles.cardtitle}>Cadastre-se</h1>
        <form action="post" className={styles.registerForm}>
          {/* E-mail */}
          <label htmlFor="email" className={styles.label}>
            E-mail:
          </label>
          <input
            type="email"
            placeholder="xxxxxxx@gmail.com"
            name="email"
            className={styles.input}
          />

          {/* Senha */}
          <label htmlFor="password" className={styles.label}>
            Senha:
          </label>
          <input
            type="password"
            placeholder="********"
            name="password"
            className={styles.input}
          />

          {/* Confirmar Senha */}
          <label htmlFor="confirm-password" className={styles.label}>
            Confirmar Senha:
          </label>
          <input
            type="password"
            placeholder="********"
            name="confirm-password"
            className={styles.input}
          />

          {/* ⭐️ Campo de Upload de Currículo Reutilizável */}
          <ResumeUpload
            fileName={fileName}
            onFileSelect={(file) => setFileName(file.name)}
            label="Currículo:"
          />
        </form>

        <Button
          target="/"
          Text="Registrar"
          className={styles.registerButton}
        />
      </main>
    </div>
  );
}

export default Register;
