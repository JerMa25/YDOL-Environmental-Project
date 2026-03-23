package com.example.backend.controller;

import com.example.backend.model.Vehicle;
import com.example.backend.repository.VehicleRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable UUID id, @RequestBody Vehicle payload) {
        return vehicleRepository.findById(id)
                .map(existing -> {
                    existing.setImmatriculation(payload.getImmatriculation());
                    existing.setLatitude(payload.getLatitude());
                    existing.setLongitude(payload.getLongitude());
                    existing.setAltitude(payload.getAltitude());
                    existing.setSpeed(payload.getSpeed());
                    existing.setStatus(payload.getStatus());
                    existing.setDriver(payload.getDriver());
                    return ResponseEntity.ok(vehicleRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveVehicle(@PathVariable UUID id) {
        return vehicleRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(com.example.backend.model.enums.VehicleStatus.OUT_OF_SERVICE);
                    vehicleRepository.save(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
