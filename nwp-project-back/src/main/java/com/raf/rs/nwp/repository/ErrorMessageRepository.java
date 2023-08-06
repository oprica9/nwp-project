package com.raf.rs.nwp.repository;

import com.raf.rs.nwp.model.ErrorMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ErrorMessageRepository extends JpaRepository<ErrorMessage, Long> {
    @Query("SELECT e FROM ErrorMessage e WHERE e.machineId IN (SELECT m.id FROM Machine m WHERE m.createdBy.email = :email)")
    Page<ErrorMessage> findAllByUserEmail(@Param("email") String email, Pageable pageable);

}