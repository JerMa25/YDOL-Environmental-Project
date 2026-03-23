package com.example.backend.service;

import com.example.backend.dto.auth.*;
import com.example.backend.model.IndividualClient;
import com.example.backend.model.PasswordResetToken;
import com.example.backend.model.enums.ClientType;
import com.example.backend.repository.IndividualClientRepository;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final IndividualClientRepository clientRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return AuthResponse.builder()
                .token(token)
                .email(request.getEmail())
                .role(role)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        IndividualClient client = new IndividualClient();
        client.setName(request.getName());
        client.setLastname(request.getLastname());
        client.setEmail(request.getEmail());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setPhone(request.getPhone());
        client.setTown(request.getTown());
        client.setQuarter(request.getQuarter());
        client.setType(ClientType.CLASSIC);
        client.setStatus("ACTIVE");
        client.setCreatedAt(LocalDateTime.now());
        clientRepository.save(client);

        var userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .email(request.getEmail())
                .role("ROLE_CLIENT")
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        // Check if user exists (any type)
        boolean exists = clientRepository.findByEmail(email).isPresent();
        if (!exists) {
            // Silently return to avoid user enumeration
            return;
        }
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .email(email)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();
        resetTokenRepository.save(resetToken);
        // In production: send email with reset link containing the token
        // For now, log it (configure spring.mail.* to enable real email sending)
        log.info("Password reset token for {}: {}", email, token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired or already been used");
        }

        String email = resetToken.getEmail();
        var clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            var client = clientOpt.get();
            client.setPassword(passwordEncoder.encode(request.getNewPassword()));
            clientRepository.save(client);
        }

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }
}
