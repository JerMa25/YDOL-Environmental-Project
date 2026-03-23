package com.example.backend.repository;

import com.example.backend.model.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnterpriseRepository extends JpaRepository<Enterprise, UUID> {
    Optional<Enterprise> findByEmail(String email);
}
