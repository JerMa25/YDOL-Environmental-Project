package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String phone;
    private String email;
    private String password;

    private String profilePicture;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String status;
}
