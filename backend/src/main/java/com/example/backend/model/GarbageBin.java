package com.example.backend.model;

import com.example.backend.model.enums.GarbageBinStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GarbageBin {

    @Id
    @GeneratedValue
    private UUID id;

    private String code;
    private String photo;

    private String town;
    private String quarter;
    private String description;

    private double latitude;
    private double longitude;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UUID createdBy;

    @Enumerated(EnumType.STRING)
    private GarbageBinStatus status;
}