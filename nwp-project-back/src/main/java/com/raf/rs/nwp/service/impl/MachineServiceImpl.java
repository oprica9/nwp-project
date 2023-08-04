package com.raf.rs.nwp.service.impl;

import com.raf.rs.nwp.dto.machine.MachineCreateDTO;
import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.exception.utils.ExceptionUtils;
import com.raf.rs.nwp.mapper.MachineMapper;
import com.raf.rs.nwp.model.ErrorMessage;
import com.raf.rs.nwp.model.Machine;
import com.raf.rs.nwp.model.User;
import com.raf.rs.nwp.model.enums.MachineStatus;
import com.raf.rs.nwp.repository.ErrorMessageRepository;
import com.raf.rs.nwp.repository.MachineRepository;
import com.raf.rs.nwp.repository.UserRepository;
import com.raf.rs.nwp.service.MachineService;
import com.raf.rs.nwp.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MachineServiceImpl implements MachineService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MachineService.class);
    private final ZoneOffset CET_ZONE_OFFSET = ZoneOffset.ofHours(2);

    private final MachineRepository machineRepository;
    private final UserRepository userRepository;
    private final ErrorMessageRepository errorMessageRepository;
    private final MachineMapper machineMapper;

    private final ExceptionUtils exceptionUtils;

    private final WebSocketService webSocketService;

    private final ThreadPoolTaskScheduler taskScheduler;

    @Override
    public Page<MachineDTO> searchMachines(
            String name,
            List<MachineStatus> statuses,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable) {

        Specification<Machine> spec = Specification.where(null);

        if (name != null) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + name + "%"));
        }

        if (statuses != null && !statuses.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("status").in(statuses));
        }

        if (dateFrom != null && dateTo != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("createdAt"), dateFrom.atStartOfDay(), dateTo.plusDays(1).atStartOfDay()));
        }

        Page<Machine> machines = machineRepository.findAll(spec, pageable);

        return machines.map(machineMapper::toDTO);
    }

    @Override
    public void startMachine(Long machineId) {
        Machine machine = getMachine(machineId);

        checkMachineAvailability(machine, MachineStatus.STOPPED);

        machine.setStatus(MachineStatus.STARTING);
        machine.setScheduledStatus(MachineStatus.RUNNING);
        saveMachineWithOptimisticLock(machine);

        Instant delay = Instant.now().plusMillis(10000 + new Random().nextInt(5000));

        // Only execute once
        taskScheduler.schedule(() -> {
            // This block is executed in a separate thread
            Machine updatedMachine = getMachine(machineId);
            updatedMachine.setStatus(MachineStatus.RUNNING);
            updatedMachine.setScheduledStatus(null);
            saveMachineWithOptimisticLock(updatedMachine);
            webSocketService.notifyStatusChange(machineMapper.toDTO(updatedMachine));
        }, delay);
    }

    @Override
    public void stopMachine(Long machineId) {
        Machine machine = getMachine(machineId);

        checkMachineAvailability(machine, MachineStatus.RUNNING);

        machine.setStatus(MachineStatus.STOPPING);
        machine.setScheduledStatus(MachineStatus.STOPPED);
        saveMachineWithOptimisticLock(machine);

        Instant delay = Instant.now().plusMillis(10000 + new Random().nextInt(5000));
        taskScheduler.schedule(() -> {
            // This block is executed in a separate thread
            LOGGER.error("STOP>>>>>>>>>>>>Machine stopped");
            Machine updatedMachine = getMachine(machineId);
            updatedMachine.setStatus(MachineStatus.STOPPED);
            updatedMachine.setScheduledStatus(null);
            saveMachineWithOptimisticLock(updatedMachine);
            webSocketService.notifyStatusChange(machineMapper.toDTO(updatedMachine));
        }, delay);
    }

    @Override
    public void restartMachine(Long machineId) {
        Machine machine = getMachine(machineId);

        checkMachineAvailability(machine, MachineStatus.RUNNING);

        machine.setStatus(MachineStatus.RESTARTING);
        machine.setScheduledStatus(MachineStatus.RESTARTING);
        saveMachineWithOptimisticLock(machine);

        Instant stopDelay = Instant.now().plusMillis(5000 + new Random().nextInt(2500));
        taskScheduler.schedule(() -> {
            // This block is executed in a separate thread
            LOGGER.error("RESTART>>>>>>>>>>>>Machine stopped");
            Machine updatedMachine = getMachine(machineId);
            updatedMachine.setStatus(MachineStatus.STOPPED);
            saveMachineWithOptimisticLock(updatedMachine);

            Instant startDelay = Instant.now().plusMillis(5000 + new Random().nextInt(2500));
            taskScheduler.schedule(() -> {
                LOGGER.error("RESTART>>>>>>>>>>>>Machine running");
                Machine machineAfterStart = getMachine(machineId);
                machineAfterStart.setStatus(MachineStatus.RUNNING);
                machineAfterStart.setScheduledStatus(null);
                saveMachineWithOptimisticLock(machineAfterStart);
                webSocketService.notifyStatusChange(machineMapper.toDTO(machineAfterStart));
            }, startDelay);

        }, stopDelay);
    }

    @Override
    @Transactional
    public MachineDTO createMachine(String email, MachineCreateDTO machineCreateDTO) {
        // check if user exists in the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("User", "email", email));

        // create a new Machine object
        Machine machine = new Machine();
        machine.setName(machineCreateDTO.getName());
        machine.setStatus(MachineStatus.STOPPED); // set the machine's status to STOPPED
        machine.setActive(true); // set the machine to active
        machine.setCreatedBy(user); // set the machine's creator to the logged-in user

        // save it to the database
        Machine savedMachine = machineRepository.save(machine);

        // convert entity back to DTO and return
        return machineMapper.toDTO(savedMachine);
    }

    @Override
    public void destroyMachine(Long machineId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("Machine", "id", machineId.toString()));

        if (!machine.getStatus().equals(MachineStatus.STOPPED)) {
            throw new IllegalStateException("Machine must be in STOPPED state to be destroyed"); // TO DO handle in exceptionUtils
        }

        machine.setActive(false);
        saveMachineWithOptimisticLock(machine);
    }

    @Override
    public void scheduleStartMachine(Long machineId, LocalDateTime scheduledDateTime) {
        taskScheduler.schedule(() -> {
            try {
                startMachine(machineId);
            } catch (Exception e) {
                logErrorMessage(machineId, "START", e.getMessage());
            }
        }, scheduledDateTime.toInstant(CET_ZONE_OFFSET));
    }

    @Override
    public void scheduleStopMachine(Long machineId, LocalDateTime scheduledDateTime) {
        taskScheduler.schedule(() -> {
            try {
                stopMachine(machineId);
            } catch (Exception e) {
                logErrorMessage(machineId, "STOP", e.getMessage());
            }
        }, scheduledDateTime.toInstant(CET_ZONE_OFFSET));
    }

    @Override
    public void scheduleRestartMachine(Long machineId, LocalDateTime scheduledDateTime) {
        taskScheduler.schedule(() -> {
            try {
                restartMachine(machineId);
            } catch (Exception e) {
                logErrorMessage(machineId, "RESTART", e.getMessage());
            }
        }, scheduledDateTime.toInstant(CET_ZONE_OFFSET));
    }

    private Machine getMachine(Long machineId) {
        return machineRepository.findById(machineId)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("Machine", "id", machineId.toString()));
    }

    private void checkMachineAvailability(Machine machine, MachineStatus requiredStatus) {
        if (machine.getScheduledStatus() != null && machine.getScheduledStatus() != requiredStatus) {
            throw exceptionUtils.createMachineException(machine.getScheduledStatus().name());
        }
        if (machine.getStatus() != requiredStatus) {
            throw exceptionUtils.createMachineException(machine.getStatus().name(), requiredStatus.name());
        }
    }

    private void saveMachineWithOptimisticLock(Machine machine) {
        try {
            machineRepository.save(machine);
        } catch (ObjectOptimisticLockingFailureException e) {
            LOGGER.error("Failed to update machine status due to concurrent modification. Please try again.");
            throw exceptionUtils.createMachineException("Failed to update machine status due to concurrent modification. Please try again.");
        }
    }

    private void logErrorMessage(Long machineId, String operation, String errorMessage) {
        ErrorMessage errorMessageEntry = new ErrorMessage();
        errorMessageEntry.setTimestamp(LocalDateTime.now());
        errorMessageEntry.setMachineId(machineId);
        errorMessageEntry.setOperation(operation);
        errorMessageEntry.setErrorMessage(errorMessage);
        errorMessageRepository.save(errorMessageEntry);
    }
}
