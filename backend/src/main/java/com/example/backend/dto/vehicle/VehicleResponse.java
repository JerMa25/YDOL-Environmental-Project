package com.example.backend.dto.vehicle;

import com.example.backend.model.enums.VehicleStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class VehicleResponse {
    private UUID id;
    private String immatriculation;
    private String brand;
    private String modele;
    private double maxCapacity;
    private double latitude;
    private double longitude;
    private double altitude;
    private double speed;
    private VehicleStatus status;
    private UUID driverId;
    private String driverName;
    private LocalDateTime createdAt;
}
