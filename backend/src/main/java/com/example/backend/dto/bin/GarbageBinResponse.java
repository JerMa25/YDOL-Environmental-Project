package com.example.backend.dto.bin;

import com.example.backend.model.enums.GarbageBinStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class GarbageBinResponse {
    private UUID id;
    private String code;
    private String town;
    private String quarter;
    private double latitude;
    private double longitude;
    private GarbageBinStatus status;
    private UUID createdBy;
    private LocalDateTime createdAt;
}
