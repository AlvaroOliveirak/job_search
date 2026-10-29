package com.jobsearch.controller;

import com.jobsearch.dto.SearchProfileRequest;
import com.jobsearch.dto.SearchProfileResponse;
import com.jobsearch.model.User;
import com.jobsearch.service.AuthService;
import com.jobsearch.service.SearchProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class SearchProfileController {

    private final SearchProfileService profileService;
    private final AuthService authService;

    public SearchProfileController(SearchProfileService profileService, AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            try {
                User user = authService.getUserByEmail(authentication.getName());
                if (user != null) {
                    return user.getId();
                }
            } catch (Exception ignored) {
            }
        }
        return 1L; // Fallback para usuário de demonstração/seed
    }

    @GetMapping
    public ResponseEntity<List<SearchProfileResponse>> listProfiles(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        List<SearchProfileResponse> profiles = profileService.listProfiles(userId);
        if (profiles.isEmpty()) {
            profiles = List.of(profileService.getOrCreateDefaultProfile(userId));
        }
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/active")
    public ResponseEntity<SearchProfileResponse> getActiveProfile(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        SearchProfileResponse response = profileService.getOrCreateDefaultProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/active")
    public ResponseEntity<SearchProfileResponse> updateActiveProfile(
            @Valid @RequestBody SearchProfileRequest request,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        SearchProfileResponse response = profileService.saveOrUpdateActiveProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<SearchProfileResponse> createProfile(
            @Valid @RequestBody SearchProfileRequest request,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        SearchProfileResponse response = profileService.createProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SearchProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody SearchProfileRequest request,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        SearchProfileResponse response = profileService.updateProfile(id, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        profileService.deleteProfile(id, userId);
        return ResponseEntity.noContent().build();
    }
}
