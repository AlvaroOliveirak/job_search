package com.jobsearch.repository;

import com.jobsearch.model.UserJobMatch;
import com.jobsearch.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserJobMatchRepository extends JpaRepository<UserJobMatch, Long> {

    List<UserJobMatch> findByUserId(Long userId);

    Optional<UserJobMatch> findByIdAndUserId(Long id, Long userId);

    Optional<UserJobMatch> findByUserIdAndJobId(Long userId, Long jobId);

    @Query("""
        SELECT m FROM UserJobMatch m
        JOIN FETCH m.job j
        WHERE m.user.id = :userId
          AND (:status IS NULL OR m.status = :status)
          AND (:isFavorite IS NULL OR m.favorite = :isFavorite)
          AND (:minScore IS NULL OR m.score >= :minScore)
          AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%'))
                             OR LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%'))
                             OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY m.score DESC, m.matchedAt DESC
    """)
    List<UserJobMatch> findMatchesWithFilters(
        @Param("userId") Long userId,
        @Param("status") MatchStatus status,
        @Param("isFavorite") Boolean isFavorite,
        @Param("minScore") Double minScore,
        @Param("search") String search
    );
}
