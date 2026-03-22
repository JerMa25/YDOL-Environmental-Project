package com.example.backend.controller;

import com.example.backend.dto.bin.GarbageBinRequest;
import com.example.backend.dto.bin.GarbageBinResponse;
import com.example.backend.service.GarbageBinService;
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
@RequestMapping("/api/bins")
@RequiredArgsConstructor
@Tag(name = "Garbage Bins", description = "Gestion des bacs à ordures")
@SecurityRequirement(name = "bearerAuth")
public class GarbageBinController {

    private final GarbageBinService binService;

    @GetMapping
    @Operation(summary = "Liste des bacs", description = "Liste tous les bacs à ordures actifs")
    public ResponseEntity<List<GarbageBinResponse>> getAll() {
        return ResponseEntity.ok(binService.getAll());
    }

    @GetMapping("/count")
    @Operation(summary = "Nombre de bacs", description = "Retourne le nombre de bacs actifs")
    public ResponseEntity<Long> getCount() {
        long count = binService.getAll().size();
        return ResponseEntity.ok(count);
    }

    @PostMapping
    @Operation(summary = "Ajouter un bac", description = "Ajoute un nouveau bac à ordures")
    public ResponseEntity<GarbageBinResponse> create(@Valid @RequestBody GarbageBinRequest request) {
        return ResponseEntity.status(201).body(binService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un bac", description = "Met à jour un bac à ordures")
    public ResponseEntity<GarbageBinResponse> update(@PathVariable UUID id,
            @Valid @RequestBody GarbageBinRequest request) {
        return ResponseEntity.ok(binService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Archiver un bac", description = "Archive un bac à ordures")
    public ResponseEntity<Void> archive(@PathVariable UUID id) {
        binService.archive(id);
        return ResponseEntity.noContent().build();
    }
}
