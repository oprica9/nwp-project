package com.raf.rs.nwp.repository;

import com.raf.rs.nwp.model.Machine;
import com.raf.rs.nwp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MachineRepository extends JpaRepository<Machine, Long>, JpaSpecificationExecutor<Machine> {

}
