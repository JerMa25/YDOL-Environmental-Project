package com.example.backend.controller;

import com.example.backend.model.Driver;
import com.example.backend.repository.DriverRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverRepository driverRepository;

    public DriverController(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@Valid @RequestBody Driver driver) {
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable UUID id, @RequestBody Driver payload) {
        return driverRepository.findById(id)
                .map(existing -> {
                    existing.setName(payload.getName());
                    existing.setEmail(payload.getEmail());
                    existing.setPhone(payload.getPhone());
                    existing.setTown(payload.getTown());
                    existing.setQuarter(payload.getQuarter());
                    existing.setSite(payload.getSite());
                    existing.setStatus(payload.getStatus());
                    return ResponseEntity.ok(driverRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveDriver(@PathVariable UUID id) {
        return driverRepository.findById(id)
                .map(existing -> {
                    existing.setStatus("ARCHIVED");
                    driverRepository.save(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
