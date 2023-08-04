package com.raf.rs.nwp.dto.machine;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MachineDTO {
    private Long id;
    private String name;
    private String status;
    private String createdBy;
    private Boolean active;
}
