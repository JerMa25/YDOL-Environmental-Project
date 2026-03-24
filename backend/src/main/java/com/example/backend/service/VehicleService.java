package com.example.backend.service;

import com.example.backend.dto.vehicle.VehicleRequest;
import com.example.backend.dto.vehicle.VehicleResponse;
import com.example.backend.model.Vehicle;
import com.example.backend.model.enums.VehicleStatus;
import com.example.backend.repository.DriverRepository;
import com.example.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() != VehicleStatus.ARCHIVED)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse create(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setImmatriculation(request.getImmatriculation());
        vehicle.setBrand(request.getBrand());
        vehicle.setModele(request.getModele());
        vehicle.setMaxCapacity(request.getMaxCapacity());
        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());
        vehicle.setAltitude(request.getAltitude());
        vehicle.setSpeed(request.getSpeed());
        vehicle.setStatus(request.getStatus() != null ? request.getStatus() : VehicleStatus.AVAILABLE);
        if (request.getDriverId() != null) {
            driverRepository.findById(request.getDriverId())
                    .ifPresent(vehicle::setDriver);
        }
        return toResponse(vehicleRepository.save(vehicle));
    }

    public VehicleResponse update(UUID id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + id));
        vehicle.setImmatriculation(request.getImmatriculation());
        vehicle.setBrand(request.getBrand());
        vehicle.setModele(request.getModele());
        vehicle.setMaxCapacity(request.getMaxCapacity());
        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());
        vehicle.setAltitude(request.getAltitude());
        vehicle.setSpeed(request.getSpeed());
        if (request.getStatus() != null)
            vehicle.setStatus(request.getStatus());
        if (request.getDriverId() != null) {
            driverRepository.findById(request.getDriverId())
                    .ifPresent(vehicle::setDriver);
        }
        return toResponse(vehicleRepository.save(vehicle));
    }

    public void archive(UUID id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + id));
        vehicle.setStatus(VehicleStatus.ARCHIVED);
        vehicleRepository.save(vehicle);
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .immatriculation(vehicle.getImmatriculation())
                .brand(vehicle.getBrand())
                .modele(vehicle.getModele())
                .maxCapacity(vehicle.getMaxCapacity())
                .latitude(vehicle.getLatitude())
                .longitude(vehicle.getLongitude())
                .altitude(vehicle.getAltitude())
                .speed(vehicle.getSpeed())
                .status(vehicle.getStatus())
                .driverId(vehicle.getDriver() != null ? vehicle.getDriver().getId() : null)
                .driverName(vehicle.getDriver() != null ? vehicle.getDriver().getName() : null)
                .createdAt(vehicle.getCreatedAt())
                .build();
    }
}
