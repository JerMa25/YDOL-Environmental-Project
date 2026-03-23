package com.example.backend.service;

import com.example.backend.dto.client.ClientRequest;
import com.example.backend.dto.client.ClientResponse;
import com.example.backend.model.Client;
import com.example.backend.model.IndividualClient;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.IndividualClientRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ClientService {

    private final IndividualClientRepository individualClientRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ClientResponse> getAll() {
        return Stream.concat(
                individualClientRepository.findAll().stream(),
                enterpriseRepository.findAll().stream()
        )
                .filter(c -> !"ARCHIVED".equals(c.getStatus()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getById(UUID id) {
        // Try individual client first
        var individualClient = individualClientRepository.findById(id);
        if (individualClient.isPresent()) {
            return toResponse(individualClient.get());
        }
        // Try enterprise client
        var enterpriseClient = enterpriseRepository.findById(id);
        if (enterpriseClient.isPresent()) {
            return toResponse(enterpriseClient.get());
        }
        throw new IllegalArgumentException("Client not found: " + id);
    }

    public ClientResponse update(UUID id, ClientRequest request) {
        // Try individual client first
        var individualClientOpt = individualClientRepository.findById(id);
        if (individualClientOpt.isPresent()) {
            var client = individualClientOpt.get();
            client.setName(request.getName());
            client.setEmail(request.getEmail());
            client.setPhone(request.getPhone());
            client.setTown(request.getTown());
            client.setQuarter(request.getQuarter());
            client.setUpdatedAt(LocalDateTime.now());
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                client.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            client.setLastname(request.getLastname());
            client.setDateOfBirth(request.getDateOfBirth());
            return toResponse(individualClientRepository.save(client));
        }
        // Try enterprise client
        var enterpriseClientOpt = enterpriseRepository.findById(id);
        if (enterpriseClientOpt.isPresent()) {
            var client = enterpriseClientOpt.get();
            client.setName(request.getName());
            client.setEmail(request.getEmail());
            client.setPhone(request.getPhone());
            client.setTown(request.getTown());
            client.setQuarter(request.getQuarter());
            client.setUpdatedAt(LocalDateTime.now());
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                client.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            return toResponse(enterpriseRepository.save(client));
        }
        throw new IllegalArgumentException("Client not found: " + id);
    }

    public void archive(UUID id) {
        // Try individual client first
        var individualClientOpt = individualClientRepository.findById(id);
        if (individualClientOpt.isPresent()) {
            var client = individualClientOpt.get();
            client.setStatus("ARCHIVED");
            client.setUpdatedAt(LocalDateTime.now());
            individualClientRepository.save(client);
            return;
        }
        // Try enterprise client
        var enterpriseClientOpt = enterpriseRepository.findById(id);
        if (enterpriseClientOpt.isPresent()) {
            var client = enterpriseClientOpt.get();
            client.setStatus("ARCHIVED");
            client.setUpdatedAt(LocalDateTime.now());
            enterpriseRepository.save(client);
            return;
        }
        throw new IllegalArgumentException("Client not found: " + id);
    }

    private ClientResponse toResponse(Client client) {
        ClientResponse.ClientResponseBuilder builder = ClientResponse.builder()
                .id(client.getId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .town(client.getTown())
                .quarter(client.getQuarter())
                .type(client.getType())
                .status(client.getStatus())
                .createdAt(client.getCreatedAt());
        if (client instanceof IndividualClient individual) {
            builder.lastname(individual.getLastname())
                    .dateOfBirth(individual.getDateOfBirth());
        }
        return builder.build();
    }
}
