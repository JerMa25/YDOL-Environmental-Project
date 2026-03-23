package com.example.backend.dto.admin;

import com.example.backend.model.enums.AdminRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String lastname;
    @NotBlank
    @Email
    private String email;
    private String password;
    private String phone;
    private String site;
    @NotNull
    private AdminRole role;
}
