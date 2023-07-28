package com.raf.rs.nwp.service.impl;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import com.raf.rs.nwp.mapper.PermissionMapper;
import com.raf.rs.nwp.repository.PermissionRepository;
import com.raf.rs.nwp.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Override
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream().map(permissionMapper::toDTO).collect(Collectors.toList());
    }
}
