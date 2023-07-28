package com.raf.rs.nwp.controller;

import com.raf.rs.nwp.dto.api_response.ApiResponse;
import com.raf.rs.nwp.dto.permission.PermissionDTO;
import com.raf.rs.nwp.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getAllPermissions() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions();
        ApiResponse<List<PermissionDTO>> response = new ApiResponse<>(ZonedDateTime.now(), "success", permissions);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
