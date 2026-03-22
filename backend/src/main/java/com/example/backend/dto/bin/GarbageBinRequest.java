package com.example.backend.dto.bin;

import com.example.backend.model.enums.GarbageBinStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GarbageBinRequest {
    @NotBlank
    private String code;
    @NotBlank
    private String town;
    private String quarter;
    private double latitude;
    private double longitude;
    private GarbageBinStatus status;
}
