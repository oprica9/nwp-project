package com.raf.rs.nwp.mapper;

import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.model.Machine;
import org.springframework.stereotype.Service;

@Service
public class MachineMapper {

    public MachineDTO toDTO(Machine machine) {
        return new MachineDTO(machine.getId(), machine.getName(), machine.getStatus().name(), machine.getCreatedBy().getEmail(), machine.getActive());
    }
}