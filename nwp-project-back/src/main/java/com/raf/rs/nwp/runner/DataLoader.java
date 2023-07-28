package com.raf.rs.nwp.runner;

import com.raf.rs.nwp.model.Permission;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.model.UserPermission;
import com.raf.rs.nwp.repository.PermissionRepository;
import com.raf.rs.nwp.repository.UserPermissionRepository;
import com.raf.rs.nwp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final UserRepository userRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return (args) -> {
            // Create permissions
            Permission writePermission = new Permission();
            writePermission.setName("can_create_users");
            permissionRepository.save(writePermission);

            Permission readPermission = new Permission();
            readPermission.setName("can_read_users");
            permissionRepository.save(readPermission);

            Permission updatePermission = new Permission();
            updatePermission.setName("can_update_users");
            permissionRepository.save(updatePermission);

            Permission deletePermission = new Permission();
            deletePermission.setName("can_delete_users");
            permissionRepository.save(deletePermission);

            // Create users
            User user1 = new User();
            user1.setEmail("admin@gmail.com");
            user1.setPassword(passwordEncoder.encode("admin"));
            user1.setFirstName("Admin");
            user1.setLastName("Admin");
            userRepository.save(user1);

            addPermissionToUser(user1, writePermission);
            addPermissionToUser(user1, readPermission);
            addPermissionToUser(user1, updatePermission);
            addPermissionToUser(user1, deletePermission);

            User user2 = new User();
            user2.setEmail("user@gmail.com");
            user2.setPassword(passwordEncoder.encode("user"));
            user2.setFirstName("User");
            user2.setLastName("User");
            userRepository.save(user2);

            addPermissionToUser(user2, writePermission);
            addPermissionToUser(user2, readPermission);

            // Testing purposes
            createNUsersWithoutPermissions(20);

        };
    }

    private void createNUsersWithoutPermissions(int n) {
        for(int i = 1; i <= n; i++) {
            User user = new User();
            user.setEmail("user" + i + "@gmail.com");
            user.setPassword(passwordEncoder.encode("password" + i));
            user.setFirstName("User" + i);
            user.setLastName("UserLastName" + i);
            userRepository.save(user);
        }
    }

    private void addPermissionToUser(User user, Permission permission) {
        UserPermission userPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermission(permission);
        userPermissionRepository.save(userPermission);
    }

}