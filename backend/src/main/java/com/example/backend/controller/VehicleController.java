package com.example.backend.controller;

import com.example.backend.dto.vehicle.VehicleRequest;
import com.example.backend.dto.vehicle.VehicleResponse;
import com.example.backend.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicles", description = "Gestion des véhicules")
@SecurityRequirement(name = "bearerAuth")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @Operation(summary = "Liste des véhicules", description = "Liste tous les véhicules actifs")
    public ResponseEntity<List<VehicleResponse>> getAll() {
        return ResponseEntity.ok(vehicleService.getAll());
    }

    @GetMapping("/count")
    @Operation(summary = "Nombre de véhicules", description = "Retourne le nombre de véhicules actifs")
    public ResponseEntity<Long> getCount() {
        long count = vehicleService.getAll().size();
        return ResponseEntity.ok(count);
    }

    @PostMapping
    @Operation(summary = "Ajouter un véhicule", description = "Ajoute un véhicule")
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(201).body(vehicleService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un véhicule", description = "Met à jour un véhicule")
    public ResponseEntity<VehicleResponse> update(@PathVariable UUID id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Archiver un véhicule", description = "Archive un véhicule")
    public ResponseEntity<Void> archive(@PathVariable UUID id) {
        vehicleService.archive(id);
        return ResponseEntity.noContent().build();
    }
}
