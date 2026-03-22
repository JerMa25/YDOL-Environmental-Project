package com.example.backend.repository;

import com.example.backend.model.GarbageBin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GarbageBinRepository extends JpaRepository<GarbageBin, UUID> {
}
