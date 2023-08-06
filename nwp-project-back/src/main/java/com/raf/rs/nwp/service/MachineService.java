package com.raf.rs.nwp.service;

import com.raf.rs.nwp.dto.machine.ErrorMessageDTO;
import com.raf.rs.nwp.dto.machine.MachineCreateDTO;
import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.model.enums.MachineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public interface MachineService {

    Page<MachineDTO> searchMachines(String name, List<MachineStatus> statuses, OffsetDateTime dateFrom, OffsetDateTime dateTo, Pageable pageable);

    void startMachine(Long machineId);

    void stopMachine(Long machineId);

    void restartMachine(Long machineId);

    MachineDTO createMachine(String email, MachineCreateDTO machineDto);

    void destroyMachine(Long machineId);

    void scheduleStartMachine(Long machineId, LocalDateTime scheduledDateTime);

    void scheduleStopMachine(Long machineId, LocalDateTime scheduledDateTime);

    void scheduleRestartMachine(Long machineId, LocalDateTime scheduledDateTime);

    List<String> getAllStatuses();

    Page<ErrorMessageDTO> getAllErrors(String userEmail, Pageable pageable);
}
