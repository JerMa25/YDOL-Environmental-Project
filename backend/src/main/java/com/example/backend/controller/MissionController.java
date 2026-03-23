package com.example.backend.controller;

import com.example.backend.model.Mission;
import com.example.backend.repository.MissionRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/missions")
@CrossOrigin(origins = "*")
public class MissionController {

    private final MissionRepository missionRepository;

    public MissionController(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Mission>> getAllMissions() {
        return ResponseEntity.ok(missionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Mission> createMission(@Valid @RequestBody Mission mission) {
        return ResponseEntity.ok(missionRepository.save(mission));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mission> updateMission(@PathVariable Long id, @RequestBody Mission payload) {
        return missionRepository.findById(id)
                .map(existing -> {
                    existing.setStartTime(payload.getStartTime());
                    existing.setEndTime(payload.getEndTime());
                    existing.setStatus(payload.getStatus());
                    existing.setExecutedBy(payload.getExecutedBy());
                    existing.setOrderedBy(payload.getOrderedBy());
                    existing.setVehicle(payload.getVehicle());
                    existing.setCity(payload.getCity());
                    existing.setDistrict(payload.getDistrict());
                    existing.setDescription(payload.getDescription());
                    existing.setPriority(payload.getPriority());
                    return ResponseEntity.ok(missionRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMission(@PathVariable Long id) {
        return missionRepository.findById(id)
                .map(existing -> {
                    missionRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
