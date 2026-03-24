package com.example.backend.controller;

import com.example.backend.dto.mission.MissionRequest;
import com.example.backend.dto.mission.MissionResponse;
import com.example.backend.service.MissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
@Tag(name = "Missions", description = "Gestion des missions de collecte")
@SecurityRequirement(name = "bearerAuth")
public class MissionController {

    private final MissionService missionService;

    @GetMapping
    @Operation(summary = "Liste des missions", description = "Retourne la liste des missions actives")
    public ResponseEntity<List<MissionResponse>> getAll() {
        return ResponseEntity.ok(missionService.getAll());
    }

    @GetMapping("/my-missions")
    @Operation(summary = "Mes missions", description = "Retourne la liste des missions assignées au chauffeur connecté")
    public ResponseEntity<List<MissionResponse>> getMyMissions() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(missionService.getMissionsByDriverEmail(email));
    }

    @GetMapping("/count")
    @Operation(summary = "Nombre de missions", description = "Retourne le nombre de missions actives")
    public ResponseEntity<Long> getCount() {
        long count = missionService.getAll().size();
        return ResponseEntity.ok(count);
    }

    @PostMapping
    @Operation(summary = "Créer une mission", description = "Crée une mission de collecte")
    public ResponseEntity<MissionResponse> create(@Valid @RequestBody MissionRequest request) {
        return ResponseEntity.status(201).body(missionService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une mission", description = "Met à jour une mission")
    public ResponseEntity<MissionResponse> update(@PathVariable Long id, @Valid @RequestBody MissionRequest request) {
        return ResponseEntity.ok(missionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer / archiver une mission", description = "Supprime ou archive une mission")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        missionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
