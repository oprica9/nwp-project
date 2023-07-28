package com.raf.rs.nwp.mapper;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import com.raf.rs.nwp.dto.user.UserDTO;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.model.UserPermission;
import com.raf.rs.nwp.security.dto.UserAuthDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMapper {

    private final PermissionMapper permissionMapper;

    public UserDTO toDTO(User user) {
        Set<PermissionDTO> permissions = user.getUserPermissions().stream()
                .map(userPermission -> permissionMapper.toDTO(userPermission.getPermission()))
                .collect(Collectors.toSet());
        return new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), permissions);
    }

    public UserAuthDetails mapToUserAuthDetails(User user) {
        List<String> permissionNames = user.getUserPermissions().stream()
                .map(userPermission -> userPermission.getPermission().getName())
                .collect(Collectors.toList());

        return new UserAuthDetails(
                user.getEmail(),
                user.getPassword(),
                permissionNames);
    }

    public User toEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());

        Set<UserPermission> userPermissions = dto.getPermissions().stream()
                .map(permissionDTO -> {
                    UserPermission userPermission = new UserPermission();
                    userPermission.setUser(user);
                    userPermission.setPermission(permissionMapper.toEntity(permissionDTO));
                    return userPermission;
                })
                .collect(Collectors.toSet());

        user.setUserPermissions(userPermissions);

        return user;
    }
}