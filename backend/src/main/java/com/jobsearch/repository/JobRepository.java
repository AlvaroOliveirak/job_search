package com.jobsearch.repository;

import com.jobsearch.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByJobHash(String jobHash);
    boolean existsByJobHash(String jobHash);
}
