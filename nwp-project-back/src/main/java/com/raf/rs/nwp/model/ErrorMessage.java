package com.raf.rs.nwp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "error_messages")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ErrorMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "error_date", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "machine_id", nullable = false)
    private Long machineId;

    @Column(name = "operation", nullable = false)
    private String operation;

    @Column(name = "error_message", nullable = false, length = 1000)
    private String errorMessage;

    // Constructors, getters, and setters
}
