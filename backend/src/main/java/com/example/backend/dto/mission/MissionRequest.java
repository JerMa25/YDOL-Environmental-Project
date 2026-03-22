package com.example.backend.dto.mission;

import com.example.backend.model.enums.MissionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MissionRequest {
    @NotNull
    private LocalDateTime start;
    private LocalDateTime end;
    private MissionStatus status;
    private UUID driverId;
    private UUID vehicleId;
    private String city;
    private String district;
    private String description;
    private String priority;
}
