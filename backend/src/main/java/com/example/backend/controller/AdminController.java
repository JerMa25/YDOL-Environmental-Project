package com.example.backend.controller;

import com.example.backend.model.Admin;
import com.example.backend.repository.AdminRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody Admin admin) {
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable UUID id, @RequestBody Admin payload) {
        return adminRepository.findById(id)
                .map(existing -> {
                    existing.setName(payload.getName());
                    existing.setEmail(payload.getEmail());
                    existing.setPhone(payload.getPhone());
                    existing.setSite(payload.getSite());
                    existing.setRole(payload.getRole());
                    existing.setStatus(payload.getStatus());
                    return ResponseEntity.ok(adminRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveAdmin(@PathVariable UUID id) {
        return adminRepository.findById(id)
                .map(existing -> {
                    existing.setStatus("ARCHIVED");
                    adminRepository.save(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
