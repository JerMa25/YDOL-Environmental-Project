package com.example.backend.model;

import com.example.backend.model.enums.ClientType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Client extends User {

    @Enumerated(EnumType.STRING)
    private ClientType type;

    private String town;
    private String quarter;
}
