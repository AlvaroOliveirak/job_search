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

    @GetMapping
    public ResponseEntity<List<SearchProfileResponse>> listProfiles(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<SearchProfileResponse> profiles = profileService.listProfiles(user.getId());
        return ResponseEntity.ok(profiles);
    }

    @PostMapping
    public ResponseEntity<SearchProfileResponse> createProfile(
            @Valid @RequestBody SearchProfileRequest request,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        SearchProfileResponse response = profileService.createProfile(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SearchProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody SearchProfileRequest request,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        SearchProfileResponse response = profileService.updateProfile(id, user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        profileService.deleteProfile(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
