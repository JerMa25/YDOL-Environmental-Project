package com.example.backend.model;

import com.example.backend.model.enums.MissionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Début de mission
    @Column(nullable = false)
    private LocalDateTime startTime;

    // Fin prévue ou réelle
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private MissionStatus status;

    // Chauffeur qui exécute la mission
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver executedBy;

    // Admin qui crée/ordonne la mission
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin orderedBy;

    // OPTIONNEL MAIS TRÈS UTILE 👇

    // Véhicule utilisé
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // Zone de collecte
    private String city;
    private String district;

    // Description (ex: "Collecte zone Bastos")
    private String description;

    // Date de création
    private LocalDateTime createdAt;

    // Date de mise à jour
    private LocalDateTime updatedAt;

    // Priorité (LOW, MEDIUM, HIGH)
    private String priority;

    // --------- LIFECYCLE ---------
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --------- GETTERS & SETTERS ---------
}