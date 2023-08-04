package com.raf.rs.nwp.repository;

import com.raf.rs.nwp.model.ErrorMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ErrorMessageRepository extends JpaRepository<ErrorMessage, Long> {

}