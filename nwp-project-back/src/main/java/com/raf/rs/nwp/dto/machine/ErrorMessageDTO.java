package com.raf.rs.nwp.dto.machine;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorMessageDTO {
    private LocalDateTime timestamp;
    private Long machineId;
    private String operation;
    private String errorMessage;
}
