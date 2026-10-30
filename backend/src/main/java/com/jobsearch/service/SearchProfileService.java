package com.jobsearch.service;

import com.jobsearch.dto.SearchProfileRequest;
import com.jobsearch.dto.SearchProfileResponse;
import com.jobsearch.model.SearchProfile;
import com.jobsearch.model.User;
import com.jobsearch.repository.SearchProfileRepository;
import com.jobsearch.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SearchProfileService {

    private final SearchProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JobService jobService;

    public SearchProfileService(SearchProfileRepository profileRepository,
                                UserRepository userRepository,
                                JobService jobService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jobService = jobService;
    }

    public List<SearchProfileResponse> listProfiles(Long userId) {
        return profileRepository.findByUserId(userId).stream()
                .map(SearchProfileResponse::new)
                .toList();
    }

    @Transactional
    public SearchProfileResponse getOrCreateDefaultProfile(Long userId) {
        List<SearchProfile> existing = profileRepository.findByUserId(userId);
        if (!existing.isEmpty()) {
            return new SearchProfileResponse(existing.get(0));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        SearchProfile defaultProfile = new SearchProfile(
                user,
                "Desenvolvedor Full Stack / Front-End",
                "React, TypeScript, Java, Spring Boot, CSS Modules, Git, REST",
                60
        );

        SearchProfile saved = profileRepository.save(defaultProfile);
        return new SearchProfileResponse(saved);
    }

    @Transactional
    public SearchProfileResponse saveOrUpdateActiveProfile(Long userId, SearchProfileRequest request) {
        List<SearchProfile> existing = profileRepository.findByUserId(userId);
        SearchProfile profile;
        if (!existing.isEmpty()) {
            profile = existing.get(0);
            profile.setName(request.getName());
            profile.setKeywords(request.getKeywords());
            profile.setMinScore(request.getMinScore());
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
            profile = new SearchProfile(
                    user,
                    request.getName(),
                    request.getKeywords(),
                    request.getMinScore()
            );
        }

        SearchProfile saved = profileRepository.save(profile);

        // Recalcula imediatamente a aderência das vagas salvas para esse usuário
        jobService.recalculateMatchesForUser(userId, request.getKeywords());

        return new SearchProfileResponse(saved);
    }

    @Transactional
    public SearchProfileResponse createProfile(Long userId, SearchProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        SearchProfile profile = new SearchProfile(
                user,
                request.getName(),
                request.getKeywords(),
                request.getMinScore()
        );

        SearchProfile saved = profileRepository.save(profile);
        jobService.recalculateMatchesForUser(userId, request.getKeywords());
        return new SearchProfileResponse(saved);
    }

    @Transactional
    public SearchProfileResponse updateProfile(Long profileId, Long userId, SearchProfileRequest request) {
        SearchProfile profile = profileRepository.findByIdAndUserId(profileId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de busca não encontrado."));

        profile.setName(request.getName());
        profile.setKeywords(request.getKeywords());
        profile.setMinScore(request.getMinScore());

        SearchProfile saved = profileRepository.save(profile);
        jobService.recalculateMatchesForUser(userId, request.getKeywords());
        return new SearchProfileResponse(saved);
    }

    @Transactional
    public void deleteProfile(Long profileId, Long userId) {
        SearchProfile profile = profileRepository.findByIdAndUserId(profileId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de busca não encontrado."));

        profileRepository.delete(profile);
    }
}
