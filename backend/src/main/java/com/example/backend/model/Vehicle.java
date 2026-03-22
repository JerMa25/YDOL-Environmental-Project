package com.example.backend.model;

import com.example.backend.model.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true, nullable = false)
    private String immatriculation;
    private String photo;
    private String name;
    private double maxCapacity;
    private String brand;
    private String modele;

    private double latitude;
    private double longitude;
    private double altitude;

    private double speed;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    // 🔗 Relation avec Driver
    @OneToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Gestion automatique des dates
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
