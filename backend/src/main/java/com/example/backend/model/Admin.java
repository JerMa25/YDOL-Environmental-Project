package com.example.backend.model;

import com.example.backend.model.enums.AdminRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AttributeOverride(
        name = "name",                 // le champ de la super-classe
        column = @Column(name = "firstname")  // ← nom de colonne dans cette table
)
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends User {

    private String lastname;

    @Enumerated(EnumType.STRING)
    private AdminRole role;

    private String site;
}
