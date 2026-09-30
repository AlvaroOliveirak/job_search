# ☕ Job Search — Back-End Spring Boot 3

API RESTful corporativa desenvolvida em **Java 17/21** com **Spring Boot 3.3.4**, responsável pelas regras de negócio, autenticação, controle de acesso e persistência de dados da plataforma **Job Search & Match IA**.

---

## 🏛️ Arquitetura e Tecnologias

- **Java 17 / 21 & Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate:** Mapeamento objeto-relacional (ORM) e consultas especializadas.
- **Spring Security 6 & JWT (io.jsonwebtoken 0.12.6):** Autenticação stateless via Bearer Token e criptografia de senhas com BCrypt.
- **Banco de Dados H2 (In-Memory):** Configurado out-of-the-box para testes imediatos sem necessidade de instalação de banco local. Suporte transparente para PostgreSQL.
- **DataSeeder Automático:** Popula o banco com usuários (`alvarooliver1802@gmail.com` / `123456`), perfis de busca e vagas iniciais compatíveis com o frontend React.
- **Maven Wrapper (`./mvnw` / `mvnw.cmd`):** Permite rodar o projeto em qualquer máquina sem precisar ter o Maven instalado previamente.

---

## 🚀 Como Executar o Back-End

### Opção 1: Via Maven Wrapper (Recomendado)
No terminal, dentro da pasta `backend`:

**No Windows (PowerShell/CMD):**
```bash
.\mvnw.cmd spring-boot:run
```

**No Linux/macOS:**
```bash
./mvnw spring-boot:run
```

### Opção 2: Via arquivo JAR empacotado
```bash
java -jar target/backend-1.0.0.jar
```

A API estará disponível em: `http://localhost:8080`  
Console H2 Web: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:jobsearchdb`, Usuário: `sa`, Senha: em branco).

---

## 📌 Principais Endpoints da API

### 1. Autenticação (`/api/auth`)
- `POST /api/auth/register`: Cadastro de novo candidato. Retorna token JWT.
- `POST /api/auth/login`: Autenticação por e-mail e senha. Retorna token JWT.
- `GET /api/auth/me`: Retorna os dados do candidato autenticado *(Requer Bearer Token)*.

### 2. Vagas e Recomendações (`/api/jobs`) *(Requer Bearer Token)*
- `GET /api/jobs`: Listagem filtrada por `status`, `is_favorite`, `min_score` e busca textual `search`.
- `GET /api/jobs/{id}`: Detalhes de uma vaga e da relação de match.
- `PATCH /api/jobs/{id}`: Atualiza status da candidatura (`applied`, `interview`, `discarded`, etc.) e favorito (`is_favorite`).

### 3. Perfis de Busca (`/api/profiles`) *(Requer Bearer Token)*
- `GET /api/profiles`: Lista os perfis de interesse do usuário.
- `POST /api/profiles`: Cria novo perfil de palavras-chave.
- `PUT /api/profiles/{id}`: Atualiza perfil existente.
- `DELETE /api/profiles/{id}`: Remove perfil.

### 4. Integração com Microserviço Python (`/api/jobs/sync`)
- `POST /api/jobs/sync`: Endpoint público/interno para o crawler e o motor de IA em Python enviarem lotes de vagas coletadas e avaliadas.

### 5. Health Check (`/api/health`)
- `GET /api/health`: Verifica a integridade da aplicação.
