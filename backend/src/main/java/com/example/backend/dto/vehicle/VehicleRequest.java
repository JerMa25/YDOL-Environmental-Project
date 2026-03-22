package com.example.backend.dto.vehicle;

import com.example.backend.model.enums.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class VehicleRequest {
    @NotBlank
    private String immatriculation;
    private double latitude;
    private double longitude;
    private double altitude;
    private double speed;
    private VehicleStatus status;
    private UUID driverId;
}
