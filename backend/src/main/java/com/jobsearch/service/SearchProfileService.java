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

    public SearchProfileService(SearchProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public List<SearchProfileResponse> listProfiles(Long userId) {
        return profileRepository.findByUserId(userId).stream()
                .map(SearchProfileResponse::new)
                .toList();
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
        return new SearchProfileResponse(saved);
    }

    @Transactional
    public void deleteProfile(Long profileId, Long userId) {
        SearchProfile profile = profileRepository.findByIdAndUserId(profileId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de busca não encontrado."));

        profileRepository.delete(profile);
    }
}
