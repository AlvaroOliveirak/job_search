export interface SkillItem {
  name: string;
  category:
    | "Linguagem"
    | "Front-end"
    | "Back-end"
    | "Mobile"
    | "Banco de Dados"
    | "DevOps & Cloud"
    | "Testes & QA"
    | "Conceitos & Métodos"
    | "IA & Dados";
}

export const IT_SKILLS_CATALOG: SkillItem[] = [
  // Linguagens
  { name: "JavaScript", category: "Linguagem" },
  { name: "TypeScript", category: "Linguagem" },
  { name: "Java", category: "Linguagem" },
  { name: "Python", category: "Linguagem" },
  { name: "C#", category: "Linguagem" },
  { name: "C++", category: "Linguagem" },
  { name: "C", category: "Linguagem" },
  { name: "PHP", category: "Linguagem" },
  { name: "Go (Golang)", category: "Linguagem" },
  { name: "Rust", category: "Linguagem" },
  { name: "Kotlin", category: "Linguagem" },
  { name: "Swift", category: "Linguagem" },
  { name: "Ruby", category: "Linguagem" },
  { name: "SQL", category: "Linguagem" },
  { name: "HTML5", category: "Linguagem" },
  { name: "CSS3", category: "Linguagem" },
  { name: "Bash / Shell", category: "Linguagem" },
  { name: "R", category: "Linguagem" },
  { name: "Scala", category: "Linguagem" },
  { name: "Dart", category: "Linguagem" },

  // Front-end
  { name: "React", category: "Front-end" },
  { name: "Angular", category: "Front-end" },
  { name: "Vue.js", category: "Front-end" },
  { name: "Next.js", category: "Front-end" },
  { name: "Tailwind CSS", category: "Front-end" },
  { name: "CSS Modules", category: "Front-end" },
  { name: "Sass / SCSS", category: "Front-end" },
  { name: "Redux", category: "Front-end" },
  { name: "Zustand", category: "Front-end" },
  { name: "Styled Components", category: "Front-end" },
  { name: "Vite", category: "Front-end" },
  { name: "Webpack", category: "Front-end" },
  { name: "Bootstrap", category: "Front-end" },
  { name: "Material UI (MUI)", category: "Front-end" },
  { name: "Chakra UI", category: "Front-end" },
  { name: "Nuxt.js", category: "Front-end" },
  { name: "Svelte", category: "Front-end" },
  { name: "React Router", category: "Front-end" },
  { name: "Axios", category: "Front-end" },

  // Back-end
  { name: "Spring Boot", category: "Back-end" },
  { name: "Node.js", category: "Back-end" },
  { name: "Express.js", category: "Back-end" },
  { name: "NestJS", category: "Back-end" },
  { name: "FastAPI", category: "Back-end" },
  { name: "Django", category: "Back-end" },
  { name: "Flask", category: "Back-end" },
  { name: "ASP.NET Core", category: "Back-end" },
  { name: ".NET Core", category: "Back-end" },
  { name: "Hibernate / JPA", category: "Back-end" },
  { name: "Laravel", category: "Back-end" },
  { name: "Ruby on Rails", category: "Back-end" },
  { name: "Microsserviços", category: "Back-end" },
  { name: "GraphQL", category: "Back-end" },
  { name: "REST API", category: "Back-end" },
  { name: "RabbitMQ", category: "Back-end" },
  { name: "Apache Kafka", category: "Back-end" },
  { name: "Prisma ORM", category: "Back-end" },
  { name: "TypeORM", category: "Back-end" },
  { name: "gRPC", category: "Back-end" },
  { name: "WebSockets", category: "Back-end" },

  // Mobile
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile" },
  { name: "Android (Java/Kotlin)", category: "Mobile" },
  { name: "iOS (Swift)", category: "Mobile" },
  { name: "Expo", category: "Mobile" },

  // Banco de Dados
  { name: "PostgreSQL", category: "Banco de Dados" },
  { name: "MySQL", category: "Banco de Dados" },
  { name: "MongoDB", category: "Banco de Dados" },
  { name: "Redis", category: "Banco de Dados" },
  { name: "Oracle Database", category: "Banco de Dados" },
  { name: "Microsoft SQL Server", category: "Banco de Dados" },
  { name: "SQLite", category: "Banco de Dados" },
  { name: "Elasticsearch", category: "Banco de Dados" },
  { name: "Firebase Firestore", category: "Banco de Dados" },
  { name: "DynamoDB", category: "Banco de Dados" },
  { name: "Cassandra", category: "Banco de Dados" },
  { name: "Supabase", category: "Banco de Dados" },

  // DevOps & Cloud
  { name: "Docker", category: "DevOps & Cloud" },
  { name: "Docker Compose", category: "DevOps & Cloud" },
  { name: "Kubernetes", category: "DevOps & Cloud" },
  { name: "Amazon Web Services (AWS)", category: "DevOps & Cloud" },
  { name: "Microsoft Azure", category: "DevOps & Cloud" },
  { name: "Google Cloud Platform (GCP)", category: "DevOps & Cloud" },
  { name: "Git", category: "DevOps & Cloud" },
  { name: "GitHub Actions", category: "DevOps & Cloud" },
  { name: "GitLab CI/CD", category: "DevOps & Cloud" },
  { name: "Jenkins", category: "DevOps & Cloud" },
  { name: "Terraform", category: "DevOps & Cloud" },
  { name: "Ansible", category: "DevOps & Cloud" },
  { name: "Linux", category: "DevOps & Cloud" },
  { name: "Nginx", category: "DevOps & Cloud" },
  { name: "Grafana", category: "DevOps & Cloud" },
  { name: "Prometheus", category: "DevOps & Cloud" },

  // Testes & QA
  { name: "JUnit", category: "Testes & QA" },
  { name: "Mockito", category: "Testes & QA" },
  { name: "Jest", category: "Testes & QA" },
  { name: "Cypress", category: "Testes & QA" },
  { name: "Selenium", category: "Testes & QA" },
  { name: "Playwright", category: "Testes & QA" },
  { name: "Postman", category: "Testes & QA" },
  { name: "Testing Library", category: "Testes & QA" },
  { name: "PyTest", category: "Testes & QA" },
  { name: "TDD", category: "Testes & QA" },

  // Conceitos & Metodologias
  { name: "Scrum", category: "Conceitos & Métodos" },
  { name: "Kanban", category: "Conceitos & Métodos" },
  { name: "Clean Architecture", category: "Conceitos & Métodos" },
  { name: "Clean Code", category: "Conceitos & Métodos" },
  { name: "Design Patterns", category: "Conceitos & Métodos" },
  { name: "SOLID", category: "Conceitos & Métodos" },
  { name: "Domain-Driven Design (DDD)", category: "Conceitos & Métodos" },
  { name: "CI/CD", category: "Conceitos & Métodos" },
  { name: "Metodologias Ágeis", category: "Conceitos & Métodos" },

  // IA & Dados
  { name: "Inteligência Artificial (IA)", category: "IA & Dados" },
  { name: "Machine Learning", category: "IA & Dados" },
  { name: "Pandas", category: "IA & Dados" },
  { name: "NumPy", category: "IA & Dados" },
  { name: "Scikit-Learn", category: "IA & Dados" },
  { name: "PyTorch", category: "IA & Dados" },
  { name: "TensorFlow", category: "IA & Dados" },
  { name: "OpenAI API / LLMs", category: "IA & Dados" },
  { name: "NLP (Processamento de Linguagem)", category: "IA & Dados" },
  { name: "Power BI", category: "IA & Dados" },
];

/**
 * Função utilitária para filtrar e ranquear habilidades conforme o que o usuário digita.
 */
export function searchSkills(query: string, currentSkills: string[] = [], limit: number = 8): SkillItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const lowerCurrent = currentSkills.map((s) => s.toLowerCase());

  return IT_SKILLS_CATALOG.filter((item) => {
    // Não sugere skills que o usuário já adicionou
    if (lowerCurrent.includes(item.name.toLowerCase())) {
      return false;
    }
    return item.name.toLowerCase().includes(q);
  })
    .sort((a, b) => {
      // Prioriza correspondência que começa exatamente com o termo digitado
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
