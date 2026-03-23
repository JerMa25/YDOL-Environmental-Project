package com.example.backend.dto.admin;

import com.example.backend.model.enums.AdminRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminResponse {
    private UUID id;
    private String name;
    private String lastname;
    private String email;
    private String phone;
    private String site;
    private AdminRole role;
    private String status;
    private LocalDateTime createdAt;
}
