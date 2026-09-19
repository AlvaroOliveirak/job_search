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
        {/* Lado Esquerdo: Título e Métricas (Opção 3) */}
        <div className={styles.asideLeft}>
          <h1>Encontre Vagas Rápido</h1>
          <p className={styles.asideSubtitle}>
            Conectamos os melhores profissionais às empresas mais inovadoras.
          </p>

          <div className={styles.metricsContainer}>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>+5.000</span>
              <span className={styles.metricLabel}>Vagas ativas</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>+800</span>
              <span className={styles.metricLabel}>Empresas parceiras</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>48h</span>
              <span className={styles.metricLabel}>
                Tempo médio de resposta
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Card Glassmorphism de Sucesso (Opção 4) */}
        <div className={styles.testimonialCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Contratação recente</span>
          </div>
          <p className={styles.cardQuote}>
            "Consegui minha primeira vaga de desenvolvedor em menos de duas
            semanas pela plataforma!"
          </p>
          <div className={styles.cardAuthor}>
            <strong>Lucas M.</strong>
            <span>Desenvolvedor Jr. • Remoto</span>
          </div>
        </div>
      </div>
      {/* 1. Como Funciona (3 Passos) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Como Funciona</h2>
          <p className={styles.sectionSubtitle}>
            Três passos simples para encontrar o seu próximo emprego.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>01</div>
            <h3>Cadastre seu Perfil</h3>
            <p>
              Preencha suas habilidades, formação e pretensão salarial em menos
              de 2 minutos.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>02</div>
            <h3>Descubra Vagas Ideais</h3>
            <p>
              Explore oportunidades filtradas por tecnologia, regime remoto e
              salário transparente.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>03</div>
            <h3>Conecte-se e Contrate</h3>
            <p>
              Candidate-se com um clique e receba retorno direto dos
              recrutadores das melhores empresas.
            </p>
          </div>
        </div>

        <Button
          target="/Register"
          Text="Começar Agora"
          className={styles.enterButton}
        />
      </section>

      {/* 2. Categorias em Destaque */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Categorias em Alta</h2>
          <p className={styles.sectionSubtitle}>
            Encontre oportunidades nas áreas com maior demanda do mercado.
          </p>
        </div>

        <div className={styles.categoriesGrid}>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>💻</span>
            <div>
              <h4>Desenvolvimento & Software</h4>
              <span>+2.400 vagas abertas</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>🎨</span>
            <div>
              <h4>Design & UX/UI</h4>
              <span>+650 vagas abertas</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>📊</span>
            <div>
              <h4>Dados & Inteligência Artificial</h4>
              <span>+920 vagas abertas</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>📢</span>
            <div>
              <h4>Marketing & Vendas</h4>
              <span>+1.100 vagas abertas</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>🛡️</span>
            <div>
              <h4>DevOps & Cibersegurança</h4>
              <span>+480 vagas abertas</span>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <span className={styles.categoryIcon}>🌍</span>
            <div>
              <h4>Vagas 100% Remotas</h4>
              <span>+1.850 vagas abertas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Por que escolher o Job Search */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Por que o Job Search?</h2>
          <p className={styles.sectionSubtitle}>
            Criado para quem busca evolução profissional de verdade.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <h3>Feedbacks Rápidos</h3>
            <p>
              Chega de ficar sem resposta. Acompanhe o status da sua candidatura
              em tempo real.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💸</div>
            <h3>Salários Transparentes</h3>
            <p>
              Vagas com faixas salariais claras desde o início, sem perder tempo
              em etapas cegas.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔒</div>
            <h3>Privacidade Total</h3>
            <p>
              Escolha se quer manter seu perfil discreto ou invisível para a sua
              empresa atual.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🆓</div>
            <h3>100% Gratuito</h3>
            <p>
              Sem taxas escondidas ou planos caros para conseguir entrevistas e
              vagas.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ (Perguntas Frequentes) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
          <p className={styles.sectionSubtitle}>
            Tudo o que você precisa saber antes de começar.
          </p>
        </div>

        <div className={styles.faqList}>
          <div className={styles.faqCard}>
            <h4>O cadastro é realmente gratuito?</h4>
            <p>
              Sim! Para candidatos, o acesso à plataforma, busca de vagas e
              candidaturas são e sempre serão 100% gratuitos.
            </p>
          </div>
          <div className={styles.faqCard}>
            <h4>Tem vagas para iniciantes, Júnior ou Estágio?</h4>
            <p>
              Com certeza! Temos filtros específicos para quem busca o primeiro
              emprego, estágio ou posições de nível Júnior.
            </p>
          </div>
          <div className={styles.faqCard}>
            <h4>Como as empresas entram em contato comigo?</h4>
            <p>
              Assim que uma empresa gostar do seu perfil, ela enviará uma
              mensagem direta para seu e-mail e pelo painel da plataforma.
            </p>
          </div>
          <div className={styles.faqCard}>
            <h4>Como funciona para vagas internacionais ou remotas?</h4>
            <p>
              Você pode filtrar vagas exclusivamente remotas de empresas de
              qualquer lugar do Brasil e do exterior.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA Final Pré-Rodapé */}
      <section className={styles.ctaSection}>
        <h2>Pronto para dar o próximo passo na sua carreira?</h2>
        <p>
          Junte-se a milhares de profissionais e receba propostas das melhores
          empresas agora mesmo.
        </p>
        <Button
          target="/Register"
          Text="Criar Conta Gratuita"
          className={styles.ctaButton}
        />
      </section>

      {/* 6. Rodapé */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>Job Search</h3>
            <p>Conectando talentos e oportunidades em todo o país.</p>
          </div>
          <div className={styles.footerLinks}>
            <span>Privacidade</span>
            <span>Termos de Uso</span>
            <span>Contato</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Job Search. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default Init;
