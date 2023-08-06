package com.raf.rs.nwp.dto.machine;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class MachineCreateDTO {
    @Size(min = 1, max = 100, message = "Machine name must be between 1 and 100 characters")
    private String name;
}