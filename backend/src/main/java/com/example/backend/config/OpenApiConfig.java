package com.example.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI wasteTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Waste Tracker API")
                        .description(
                                "API complète pour la gestion de la collecte des déchets : authentification, admins, chauffeurs, clients, bacs, véhicules et missions.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("YDOL Environmental Project")
                                .email("contact@ydol.cm"))
                        .license(new License().name("Private")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .name(BEARER_AUTH)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Entrez votre token JWT (sans le préfixe 'Bearer ')")));
    }
}
