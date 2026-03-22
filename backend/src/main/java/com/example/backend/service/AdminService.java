package com.example.backend.service;

import com.example.backend.dto.admin.AdminRequest;
import com.example.backend.dto.admin.AdminResponse;
import com.example.backend.model.Admin;
import com.example.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminResponse> getAll() {
        return adminRepository.findAll().stream()
                .filter(a -> !"ARCHIVED".equals(a.getStatus()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AdminResponse create(AdminRequest request) {
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setSurname(request.getSurname());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setSite(request.getSite());
        admin.setRole(request.getRole());
        admin.setStatus("ACTIVE");
        admin.setCreatedAt(LocalDateTime.now());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return toResponse(adminRepository.save(admin));
    }

    public AdminResponse update(UUID id, AdminRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + id));
        admin.setName(request.getName());
        admin.setSurname(request.getSurname());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setSite(request.getSite());
        admin.setRole(request.getRole());
        admin.setUpdatedAt(LocalDateTime.now());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return toResponse(adminRepository.save(admin));
    }

    public void archive(UUID id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: " + id));
        admin.setStatus("ARCHIVED");
        admin.setUpdatedAt(LocalDateTime.now());
        adminRepository.save(admin);
    }

    private AdminResponse toResponse(Admin admin) {
        return AdminResponse.builder()
                .id(admin.getId())
                .name(admin.getName())
                .surname(admin.getSurname())
                .email(admin.getEmail())
                .phone(admin.getPhone())
                .site(admin.getSite())
                .role(admin.getRole())
                .status(admin.getStatus())
                .createdAt(admin.getCreatedAt())
                .build();
    }
}
