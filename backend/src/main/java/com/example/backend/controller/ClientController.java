package com.example.backend.controller;

import com.example.backend.model.Client;
import com.example.backend.model.IndividualClient;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.IndividualClientRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final IndividualClientRepository individualClientRepository;
    private final EnterpriseRepository enterpriseRepository;

    public ClientController(IndividualClientRepository individualClientRepository, EnterpriseRepository enterpriseRepository) {
        this.individualClientRepository = individualClientRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> allClients = Stream.concat(
                individualClientRepository.findAll().stream(),
                enterpriseRepository.findAll().stream()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(allClients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable UUID id) {
        // Try individual client first
        var individualClient = individualClientRepository.findById(id);
        if (individualClient.isPresent()) {
            return ResponseEntity.ok(individualClient.get());
        }
        // Try enterprise client
        var enterpriseClient = enterpriseRepository.findById(id);
        return enterpriseClient.<ResponseEntity<Client>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody IndividualClient client) {
        Client saved = individualClientRepository.save(client);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable UUID id, @RequestBody Client payload) {
        // Try individual client first
        var individualClientOpt = individualClientRepository.findById(id);
        if (individualClientOpt.isPresent()) {
            var existing = individualClientOpt.get();
            existing.setName(payload.getName());
            existing.setEmail(payload.getEmail());
            existing.setPhone(payload.getPhone());
            existing.setTown(payload.getTown());
            existing.setQuarter(payload.getQuarter());
            existing.setStatus(payload.getStatus());
            return ResponseEntity.ok(individualClientRepository.save(existing));
        }
        // Try enterprise client
        var enterpriseClientOpt = enterpriseRepository.findById(id);
        if (enterpriseClientOpt.isPresent()) {
            var existing = enterpriseClientOpt.get();
            existing.setName(payload.getName());
            existing.setEmail(payload.getEmail());
            existing.setPhone(payload.getPhone());
            existing.setTown(payload.getTown());
            existing.setQuarter(payload.getQuarter());
            existing.setStatus(payload.getStatus());
            return ResponseEntity.ok(enterpriseRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveClient(@PathVariable UUID id) {
        // Try individual client first
        var individualClientOpt = individualClientRepository.findById(id);
        if (individualClientOpt.isPresent()) {
            var existing = individualClientOpt.get();
            existing.setStatus("ARCHIVED");
            individualClientRepository.save(existing);
            return ResponseEntity.noContent().build();
        }
        // Try enterprise client
        var enterpriseClientOpt = enterpriseRepository.findById(id);
        if (enterpriseClientOpt.isPresent()) {
            var existing = enterpriseClientOpt.get();
            existing.setStatus("ARCHIVED");
            enterpriseRepository.save(existing);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
