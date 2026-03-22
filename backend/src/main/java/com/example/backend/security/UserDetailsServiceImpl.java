package com.example.backend.security;

import com.example.backend.repository.AdminRepository;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;
    private final DriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Try Admin first
        var admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + admin.get().getRole().name())));
        }
        // Try Client
        var client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            return new User(
                    client.get().getEmail(),
                    client.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CLIENT")));
        }
        // Try Driver
        var driver = driverRepository.findByEmail(email);
        if (driver.isPresent()) {
            return new User(
                    driver.get().getEmail(),
                    driver.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_DRIVER")));
        }
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
