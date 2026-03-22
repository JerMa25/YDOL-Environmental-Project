package com.example.backend.service;

import com.example.backend.dto.bin.GarbageBinRequest;
import com.example.backend.dto.bin.GarbageBinResponse;
import com.example.backend.model.GarbageBin;
import com.example.backend.model.enums.GarbageBinStatus;
import com.example.backend.repository.GarbageBinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GarbageBinService {

    private final GarbageBinRepository binRepository;

    public List<GarbageBinResponse> getAll() {
        return binRepository.findAll().stream()
                .filter(b -> b.getStatus() != GarbageBinStatus.ARCHIVED)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GarbageBinResponse create(GarbageBinRequest request) {
        GarbageBin bin = new GarbageBin();
        bin.setCode(request.getCode());
        bin.setTown(request.getTown());
        bin.setQuarter(request.getQuarter());
        bin.setLatitude(request.getLatitude());
        bin.setLongitude(request.getLongitude());
        bin.setStatus(request.getStatus() != null ? request.getStatus() : GarbageBinStatus.ACTIVE);
        bin.setCreatedAt(LocalDateTime.now());
        return toResponse(binRepository.save(bin));
    }

    public GarbageBinResponse update(UUID id, GarbageBinRequest request) {
        GarbageBin bin = binRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("GarbageBin not found: " + id));
        bin.setCode(request.getCode());
        bin.setTown(request.getTown());
        bin.setQuarter(request.getQuarter());
        bin.setLatitude(request.getLatitude());
        bin.setLongitude(request.getLongitude());
        if (request.getStatus() != null)
            bin.setStatus(request.getStatus());
        bin.setUpdatedAt(LocalDateTime.now());
        return toResponse(binRepository.save(bin));
    }

    public void archive(UUID id) {
        GarbageBin bin = binRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("GarbageBin not found: " + id));
        bin.setStatus(GarbageBinStatus.ARCHIVED);
        bin.setUpdatedAt(LocalDateTime.now());
        binRepository.save(bin);
    }

    private GarbageBinResponse toResponse(GarbageBin bin) {
        return GarbageBinResponse.builder()
                .id(bin.getId())
                .code(bin.getCode())
                .town(bin.getTown())
                .quarter(bin.getQuarter())
                .latitude(bin.getLatitude())
                .longitude(bin.getLongitude())
                .status(bin.getStatus())
                .createdBy(bin.getCreatedBy())
                .createdAt(bin.getCreatedAt())
                .build();
    }
}
