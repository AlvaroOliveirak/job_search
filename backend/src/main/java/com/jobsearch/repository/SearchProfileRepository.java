package com.jobsearch.repository;

import com.jobsearch.model.SearchProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchProfileRepository extends JpaRepository<SearchProfile, Long> {
    List<SearchProfile> findByUserId(Long userId);
    Optional<SearchProfile> findByIdAndUserId(Long id, Long userId);
}
