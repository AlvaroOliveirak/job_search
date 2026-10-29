package com.jobsearch.config;

import com.jobsearch.model.SearchProfile;
import com.jobsearch.model.User;
import com.jobsearch.repository.SearchProfileRepository;
import com.jobsearch.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SearchProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      SearchProfileRepository profileRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Cria usuários iniciais de teste (sem vagas falsas - as vagas são alimentadas ao vivo pelo Scraper)
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

        // 2. Cria perfis de busca iniciais para o cálculo de aderência (AIMatcher)
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
    }
}
