package com.raf.rs.nwp.service.impl;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import com.raf.rs.nwp.dto.user.UserCreateDTO;
import com.raf.rs.nwp.dto.user.UserDTO;
import com.raf.rs.nwp.dto.user.UserUpdateDTO;
import com.raf.rs.nwp.exception.utils.ExceptionUtils;
import com.raf.rs.nwp.mapper.UserMapper;
import com.raf.rs.nwp.model.Permission;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.model.UserPermission;
import com.raf.rs.nwp.repository.PermissionRepository;
import com.raf.rs.nwp.repository.UserPermissionRepository;
import com.raf.rs.nwp.repository.UserRepository;
import com.raf.rs.nwp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final PermissionRepository permissionRepository;
    private final ExceptionUtils exceptionUtils;

    @Override
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        // Check if the email is already used
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw exceptionUtils.createResourceAlreadyExistsException("User", "email", userCreateDTO.getEmail());
        }
        // Create new User entity
        User user = new User();
        // Hash the password
        user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));

        // Set user-sent data
        user.setEmail(userCreateDTO.getEmail());
        user.setFirstName(userCreateDTO.getFirstName());
        user.setLastName(userCreateDTO.getLastName());

        // Save User
        User savedUser = userRepository.save(user);

        // Create and save UserPermissions
        Set<UserPermission> userPermissions = getUserPermissions(savedUser, userCreateDTO.getPermissions());

        // save new UserPermission
        userPermissionRepository.saveAll(userPermissions);
        user.setUserPermissions(userPermissions);

        return userMapper.toDTO(savedUser);
    }

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDTO);
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userMapper.toDTO(userRepository.findById(id).orElseThrow(() ->
                exceptionUtils.createResourceNotFoundException("User", "id", id.toString())
        ));
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id).orElseThrow(() ->
                exceptionUtils.createResourceNotFoundException("User", "id", id.toString())
        );

        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }
        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        if (userUpdateDTO.getPermissions() != null) {
            Set<UserPermission> newUserPermissions = getUserPermissions(user, userUpdateDTO.getPermissions());

            // clear existing UserPermission
            user.getUserPermissions().clear();
            userPermissionRepository.deleteByUserId(user.getId());

            // save new UserPermission
            userPermissionRepository.saveAll(newUserPermissions);
            user.setUserPermissions(newUserPermissions);
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.findById(id).orElseThrow(() ->
                exceptionUtils.createResourceNotFoundException("User", "id", id.toString())
        );
        userRepository.deleteById(id);
    }

    // helper methods

    private Set<UserPermission> getUserPermissions(User user, Set<PermissionDTO> permissions) {
        return permissions.stream()
                .map(permissionDTO -> {
                    Permission permission = permissionRepository.findByName(permissionDTO.getName())
                            .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("Permission", "name", permissionDTO.getName()));
                    UserPermission userPermission = new UserPermission();
                    userPermission.setUser(user);
                    userPermission.setPermission(permission);
                    return userPermission;
                })
                .collect(Collectors.toSet());
    }

}