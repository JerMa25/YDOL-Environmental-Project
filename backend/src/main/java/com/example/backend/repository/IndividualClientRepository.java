package com.example.backend.repository;

import com.example.backend.model.IndividualClient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IndividualClientRepository extends JpaRepository<IndividualClient, UUID> {
    Optional<IndividualClient> findByEmail(String email);
}
