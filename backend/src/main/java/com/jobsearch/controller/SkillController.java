package com.jobsearch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private static final List<Map<String, String>> CANONICAL_SKILLS = Arrays.asList(
            Map.of("name", "Java", "category", "Linguagem"),
            Map.of("name", "JavaScript", "category", "Linguagem"),
            Map.of("name", "TypeScript", "category", "Linguagem"),
            Map.of("name", "Python", "category", "Linguagem"),
            Map.of("name", "C#", "category", "Linguagem"),
            Map.of("name", "C++", "category", "Linguagem"),
            Map.of("name", "PHP", "category", "Linguagem"),
            Map.of("name", "Go (Golang)", "category", "Linguagem"),
            Map.of("name", "Rust", "category", "Linguagem"),
            Map.of("name", "Kotlin", "category", "Linguagem"),
            Map.of("name", "Swift", "category", "Linguagem"),
            Map.of("name", "Ruby", "category", "Linguagem"),
            Map.of("name", "SQL", "category", "Linguagem"),
            Map.of("name", "HTML5", "category", "Linguagem"),
            Map.of("name", "CSS3", "category", "Linguagem"),
            Map.of("name", "React", "category", "Front-end"),
            Map.of("name", "Angular", "category", "Front-end"),
            Map.of("name", "Vue.js", "category", "Front-end"),
            Map.of("name", "Next.js", "category", "Front-end"),
            Map.of("name", "Tailwind CSS", "category", "Front-end"),
            Map.of("name", "CSS Modules", "category", "Front-end"),
            Map.of("name", "Redux", "category", "Front-end"),
            Map.of("name", "Spring Boot", "category", "Back-end"),
            Map.of("name", "Node.js", "category", "Back-end"),
            Map.of("name", "Express.js", "category", "Back-end"),
            Map.of("name", "NestJS", "category", "Back-end"),
            Map.of("name", "FastAPI", "category", "Back-end"),
            Map.of("name", "Django", "category", "Back-end"),
            Map.of("name", "ASP.NET Core", "category", "Back-end"),
            Map.of("name", "Hibernate / JPA", "category", "Back-end"),
            Map.of("name", "REST API", "category", "Back-end"),
            Map.of("name", "GraphQL", "category", "Back-end"),
            Map.of("name", "Microsserviços", "category", "Back-end"),
            Map.of("name", "React Native", "category", "Mobile"),
            Map.of("name", "Flutter", "category", "Mobile"),
            Map.of("name", "PostgreSQL", "category", "Banco de Dados"),
            Map.of("name", "MySQL", "category", "Banco de Dados"),
            Map.of("name", "MongoDB", "category", "Banco de Dados"),
            Map.of("name", "Redis", "category", "Banco de Dados"),
            Map.of("name", "Docker", "category", "DevOps & Cloud"),
            Map.of("name", "Docker Compose", "category", "DevOps & Cloud"),
            Map.of("name", "Kubernetes", "category", "DevOps & Cloud"),
            Map.of("name", "Amazon Web Services (AWS)", "category", "DevOps & Cloud"),
            Map.of("name", "Microsoft Azure", "category", "DevOps & Cloud"),
            Map.of("name", "Google Cloud Platform (GCP)", "category", "DevOps & Cloud"),
            Map.of("name", "Git", "category", "DevOps & Cloud"),
            Map.of("name", "CI/CD", "category", "DevOps & Cloud"),
            Map.of("name", "Linux", "category", "DevOps & Cloud"),
            Map.of("name", "JUnit", "category", "Testes & QA"),
            Map.of("name", "Mockito", "category", "Testes & QA"),
            Map.of("name", "Jest", "category", "Testes & QA"),
            Map.of("name", "Cypress", "category", "Testes & QA"),
            Map.of("name", "Postman", "category", "Testes & QA"),
            Map.of("name", "Scrum", "category", "Conceitos & Métodos"),
            Map.of("name", "Clean Architecture", "category", "Conceitos & Métodos"),
            Map.of("name", "SOLID", "category", "Conceitos & Métodos")
    );

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getSkills(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) {
            return ResponseEntity.ok(CANONICAL_SKILLS);
        }

        String query = search.trim().toLowerCase();
        List<Map<String, String>> filtered = CANONICAL_SKILLS.stream()
                .filter(s -> s.get("name").toLowerCase().contains(query))
                .toList();

        return ResponseEntity.ok(filtered);
    }
}
