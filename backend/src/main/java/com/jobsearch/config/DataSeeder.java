package com.jobsearch.config;

import com.jobsearch.model.Job;
import com.jobsearch.model.SearchProfile;
import com.jobsearch.model.User;
import com.jobsearch.model.UserJobMatch;
import com.jobsearch.model.enums.MatchStatus;
import com.jobsearch.repository.JobRepository;
import com.jobsearch.repository.SearchProfileRepository;
import com.jobsearch.repository.UserJobMatchRepository;
import com.jobsearch.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final UserJobMatchRepository matchRepository;
    private final SearchProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      JobRepository jobRepository,
                      UserJobMatchRepository matchRepository,
                      SearchProfileRepository profileRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.matchRepository = matchRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Cria usuários iniciais de teste
        User alvaro = new User(
                "alvarooliver1802@gmail.com",
                passwordEncoder.encode("123456"),
                "Álvaro Oliveira",
                "123456789"
        );
        userRepository.save(alvaro);

        User demo = new User(
                "candidato@jobsearch.com",
                passwordEncoder.encode("123456"),
                "Candidato Demo",
                "987654321"
        );
        userRepository.save(demo);

        // 2. Cria perfis de busca iniciais
        SearchProfile profile1 = new SearchProfile(
                alvaro,
                "Desenvolvedor Front-End / Full-Stack",
                "React, TypeScript, Java, Spring Boot, CSS Modules",
                70
        );
        profileRepository.save(profile1);

        SearchProfile profile2 = new SearchProfile(
                demo,
                "Engenharia de Software Júnior",
                "React, JavaScript, Python, FastAPI, SQL",
                60
        );
        profileRepository.save(profile2);

        // 3. Cadastra vagas iniciais (compatíveis com o feed de dados do front-end)
        Job job1 = new Job(
                "hash_gupy_001",
                "Desenvolvedor Front-end Júnior (React / TypeScript)",
                "Nubank",
                "Remoto - Brasil",
                "https://nubank.gupy.io",
                "Buscamos pessoa desenvolvedora Front-end Júnior para construir componentes em React, TypeScript e integrar com microsserviços.",
                "Gupy",
                LocalDateTime.now().minusDays(2)
        );

        Job job2 = new Job(
                "hash_gupy_002",
                "Desenvolvedor Back-End Java / Spring Boot Júnior",
                "Mercado Livre",
                "São Paulo, SP (Híbrido)",
                "https://mercadolivre.gupy.io",
                "Oportunidade para atuar com arquitetura de microsserviços, Spring Boot 3, mensageria e banco de dados distribuídos.",
                "Gupy",
                LocalDateTime.now().minusDays(1)
        );

        Job job3 = new Job(
                "hash_gupy_003",
                "Desenvolvedor Full Stack Júnior (React & Node.js/Java)",
                "iFood",
                "Remoto - Brasil",
                "https://ifood.gupy.io",
                "Construção de aplicações escaláveis, REST APIs em Java e interfaces dinâmicas em React com foco em alta conversão.",
                "Gupy",
                LocalDateTime.now().minusHours(12)
        );

        Job job4 = new Job(
                "hash_gupy_004",
                "Engenheiro de Dados Júnior (Python & Cloud)",
                "Stone",
                "Rio de Janeiro, RJ (Híbrido)",
                "https://stone.gupy.io",
                "Desenvolvimento de pipelines ETL com Python, Apache Spark, orquestração e data warehouses corporativos.",
                "Gupy",
                LocalDateTime.now().minusDays(3)
        );

        Job job5 = new Job(
                "hash_gupy_005",
                "Desenvolvedor Mobile React Native Júnior",
                "PicPay",
                "Remoto - Brasil",
                "https://picpay.gupy.io",
                "Atuação no desenvolvimento de novas funcionalidades mobile em React Native, integração com APIs e testes automatizados.",
                "Gupy",
                LocalDateTime.now().minusDays(4)
        );

        jobRepository.saveAll(List.of(job1, job2, job3, job4, job5));

        // 4. Cria matches para o usuário Álvaro
        UserJobMatch m1 = new UserJobMatch(alvaro, job1, 95.0, MatchStatus.APPLIED);
        m1.setFavorite(true);

        UserJobMatch m2 = new UserJobMatch(alvaro, job2, 92.0, MatchStatus.INTERVIEW);
        m2.setFavorite(true);

        UserJobMatch m3 = new UserJobMatch(alvaro, job3, 88.0, MatchStatus.VIEWED);

        UserJobMatch m4 = new UserJobMatch(alvaro, job4, 74.0, MatchStatus.NEW);

        UserJobMatch m5 = new UserJobMatch(alvaro, job5, 81.0, MatchStatus.NEW);

        matchRepository.saveAll(List.of(m1, m2, m3, m4, m5));

        // Cria matches para o usuário Demo
        UserJobMatch d1 = new UserJobMatch(demo, job1, 90.0, MatchStatus.APPLIED);
        UserJobMatch d2 = new UserJobMatch(demo, job2, 85.0, MatchStatus.NEW);
        matchRepository.saveAll(List.of(d1, d2));
    }
}
