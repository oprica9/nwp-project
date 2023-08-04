package com.raf.rs.nwp.runner;

import com.raf.rs.nwp.model.Machine;
import com.raf.rs.nwp.model.Permission;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.model.UserPermission;
import com.raf.rs.nwp.model.enums.MachineStatus;
import com.raf.rs.nwp.repository.MachineRepository;
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
    private final MachineRepository machineRepository;

    @Bean
    public CommandLineRunner initData() {
        return (args) -> {
            // Create permissions
            Permission can_create_users = new Permission();
            can_create_users.setName("can_create_users");
            permissionRepository.save(can_create_users);

            Permission can_read_users = new Permission();
            can_read_users.setName("can_read_users");
            permissionRepository.save(can_read_users);

            Permission can_update_users = new Permission();
            can_update_users.setName("can_update_users");
            permissionRepository.save(can_update_users);

            Permission can_delete_users = new Permission();
            can_delete_users.setName("can_delete_users");
            permissionRepository.save(can_delete_users);

            Permission can_search_machines = new Permission();
            can_search_machines.setName("can_search_machines");
            permissionRepository.save(can_search_machines);

            Permission can_start_machines = new Permission();
            can_start_machines.setName("can_start_machines");
            permissionRepository.save(can_start_machines);

            Permission can_stop_machines = new Permission();
            can_stop_machines.setName("can_stop_machines");
            permissionRepository.save(can_stop_machines);

            Permission can_restart_machines = new Permission();
            can_restart_machines.setName("can_restart_machines");
            permissionRepository.save(can_restart_machines);

            Permission can_create_machines = new Permission();
            can_create_machines.setName("can_create_machines");
            permissionRepository.save(can_create_machines);

            Permission can_destroy_machines = new Permission();
            can_destroy_machines.setName("can_destroy_machines");
            permissionRepository.save(can_destroy_machines);

            // Create users
            User user1 = new User();
            user1.setEmail("admin@gmail.com");
            user1.setPassword(passwordEncoder.encode("admin"));
            user1.setFirstName("Admin");
            user1.setLastName("Admin");
            userRepository.save(user1);

            addPermissionToUser(user1, can_create_users);
            addPermissionToUser(user1, can_read_users);
            addPermissionToUser(user1, can_update_users);
            addPermissionToUser(user1, can_delete_users);
            addPermissionToUser(user1, can_search_machines);
            addPermissionToUser(user1, can_start_machines);
            addPermissionToUser(user1, can_stop_machines);
            addPermissionToUser(user1, can_restart_machines);
            addPermissionToUser(user1, can_create_machines);
            addPermissionToUser(user1, can_destroy_machines);

            User user2 = new User();
            user2.setEmail("user@gmail.com");
            user2.setPassword(passwordEncoder.encode("user"));
            user2.setFirstName("User");
            user2.setLastName("User");
            userRepository.save(user2);

            addPermissionToUser(user2, can_create_users);
            addPermissionToUser(user2, can_read_users);

            // Testing purposes
            createNUsersWithoutPermissions(20);

        };
    }

    private void createNUsersWithoutPermissions(int n) {
        for (int i = 1; i <= n; i++) {
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