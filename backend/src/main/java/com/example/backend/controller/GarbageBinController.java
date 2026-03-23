package com.example.backend.controller;

import com.example.backend.model.GarbageBin;
import com.example.backend.repository.GarbageBinRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/bins")
@CrossOrigin(origins = "*")
public class GarbageBinController {

    private final GarbageBinRepository garbageBinRepository;

    public GarbageBinController(GarbageBinRepository garbageBinRepository) {
        this.garbageBinRepository = garbageBinRepository;
    }

    @GetMapping
    public ResponseEntity<List<GarbageBin>> getAllBins() {
        return ResponseEntity.ok(garbageBinRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<GarbageBin> createBin(@Valid @RequestBody GarbageBin garbageBin) {
        return ResponseEntity.ok(garbageBinRepository.save(garbageBin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GarbageBin> updateBin(@PathVariable UUID id, @RequestBody GarbageBin payload) {
        return garbageBinRepository.findById(id)
                .map(existing -> {
                    existing.setCode(payload.getCode());
                    existing.setTown(payload.getTown());
                    existing.setQuarter(payload.getQuarter());
                    existing.setLatitude(payload.getLatitude());
                    existing.setLongitude(payload.getLongitude());
                    existing.setAltitude(payload.getAltitude());
                    existing.setStatus(payload.getStatus());
                    return ResponseEntity.ok(garbageBinRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveBin(@PathVariable UUID id) {
        return garbageBinRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(com.example.backend.model.enums.GarbageBinStatus.OUT_OF_SERVICE);
                    garbageBinRepository.save(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
