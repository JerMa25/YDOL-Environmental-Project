package com.example.backend.repository;

import com.example.backend.model.Driver;
import com.example.backend.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByExecutedBy(Driver driver);
    List<Mission> findByExecutedByEmail(String email);
}
