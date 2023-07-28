package com.raf.rs.nwp.repository;

import com.raf.rs.nwp.model.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

    void deleteByUserId(Long id);

}
