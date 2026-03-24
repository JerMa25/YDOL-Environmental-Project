package com.example.backend.service;

import com.example.backend.dto.client.ClientRequest;
import com.example.backend.dto.client.ClientResponse;
import com.example.backend.model.Client;
import com.example.backend.model.IndividualClient;
import com.example.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ClientResponse> getAll() {
        return clientRepository.findAll().stream()
                .filter(c -> !"ARCHIVED".equals(c.getStatus()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getById(UUID id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Client not found: " + id));
        return toResponse(client);
    }

    public ClientResponse update(UUID id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Client not found: " + id));
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setTown(request.getTown());
        client.setQuarter(request.getQuarter());
        client.setUpdatedAt(LocalDateTime.now());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            client.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (client instanceof IndividualClient individual) {
            individual.setLastname(request.getSurname());
            individual.setDateOfBirth(request.getDateOfBirth());
        }
        return toResponse(clientRepository.save(client));
    }

    public void archive(UUID id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Client not found: " + id));
        client.setStatus("ARCHIVED");
        client.setUpdatedAt(LocalDateTime.now());
        clientRepository.save(client);
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
            builder.surname(individual.getLastname())
                    .dateOfBirth(individual.getDateOfBirth());
        }
        return builder.build();
    }
}
