package com.raf.rs.nwp.mapper;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import com.raf.rs.nwp.model.Permission;
import org.springframework.stereotype.Service;

@Service
public class PermissionMapper {

    public PermissionDTO toDTO(Permission permission) {
        return new PermissionDTO(permission.getName());
    }

}
