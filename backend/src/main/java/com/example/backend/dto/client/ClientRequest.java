package com.example.backend.dto.client;

import com.example.backend.model.enums.ClientType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ClientRequest {
    @NotBlank
    private String name;
    private String lastname;
    @NotBlank
    @Email
    private String email;
    private String password;
    private String phone;
    private String town;
    private String quarter;
    @NotNull
    private ClientType type;
    // Individual
    private LocalDate dateOfBirth;
}
