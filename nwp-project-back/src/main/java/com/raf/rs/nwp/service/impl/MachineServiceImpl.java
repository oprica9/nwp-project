package com.raf.rs.nwp.service.impl;

import com.raf.rs.nwp.dto.machine.ErrorMessageDTO;
import com.raf.rs.nwp.dto.machine.MachineCreateDTO;
import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.exception.utils.ExceptionUtils;
import com.raf.rs.nwp.mapper.ErrorMessageMapper;
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
import com.raf.rs.nwp.utils.DelayUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MachineServiceImpl implements MachineService {

    private final ZoneOffset CET_ZONE_OFFSET = ZoneOffset.ofHours(2);

    private final MachineRepository machineRepository;
    private final UserRepository userRepository;
    private final ErrorMessageRepository errorMessageRepository;
    private final MachineMapper machineMapper;
    private final ErrorMessageMapper errorMessageMapper;
    private final ExceptionUtils exceptionUtils;
    private final WebSocketService webSocketService;
    private final ThreadPoolTaskScheduler taskScheduler;

    @Override
    public Page<MachineDTO> searchMachines(
            String name,
            List<MachineStatus> statuses,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo,
            Pageable pageable) {

        Specification<Machine> spec = Specification.where(null);

        if (name != null) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + name + "%"));
        }

        if (statuses != null && !statuses.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.get("status").in(statuses));
        }

        if (dateFrom != null && dateTo != null) {
            spec = spec.and((root, query, cb) -> cb.between(root.get("createdAt"), dateFrom, dateTo));
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
        webSocketService.notifyStatusChange(machineMapper.toDTO(machine));

        Instant delay = DelayUtils.getDelay(10000, 5000);

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
        webSocketService.notifyStatusChange(machineMapper.toDTO(machine));

        Instant delay = DelayUtils.getDelay(10000, 5000);
        taskScheduler.schedule(() -> {
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
        webSocketService.notifyStatusChange(machineMapper.toDTO(machine));

        Instant stopDelay = DelayUtils.getDelay(5000, 2500);
        taskScheduler.schedule(() -> {
            Machine updatedMachine = getMachine(machineId);
            updatedMachine.setStatus(MachineStatus.STOPPED);
            saveMachineWithOptimisticLock(updatedMachine);

            Instant startDelay = DelayUtils.getDelay(5000, 2500);
            taskScheduler.schedule(() -> {
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("User", "email", email));

        Machine machine = new Machine();
        machine.setName(machineCreateDTO.getName());
        machine.setStatus(MachineStatus.STOPPED);
        machine.setActive(true);
        machine.setCreatedBy(user);

        Machine savedMachine = machineRepository.save(machine);

        return machineMapper.toDTO(savedMachine);
    }

    @Override
    public void destroyMachine(Long machineId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("Machine", "id", machineId.toString()));

        checkMachineAvailability(machine, MachineStatus.STOPPED);

        machine.setActive(false);
        saveMachineWithOptimisticLock(machine);
        webSocketService.notifyActivityChange(machineMapper.toDTO(machine));
    }

    @Override
    public void scheduleStartMachine(Long machineId, LocalDateTime scheduledDateTime) {
        machineExists(machineId);
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
        machineExists(machineId);
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
        machineExists(machineId);
        taskScheduler.schedule(() -> {
            try {
                restartMachine(machineId);
            } catch (Exception e) {
                logErrorMessage(machineId, "RESTART", e.getMessage());
            }
        }, scheduledDateTime.toInstant(CET_ZONE_OFFSET));
    }

    @Override
    public List<String> getAllStatuses() {
        return Arrays.stream(MachineStatus.values()).map(Enum::name).collect(Collectors.toList());
    }

    @Override
    public Page<ErrorMessageDTO> getAllErrors(String email, Pageable pageable) {
        Page<ErrorMessage> errorMessages = errorMessageRepository.findAllByUserEmail(email, pageable);
        return errorMessages.map(errorMessageMapper::toDTO);
    }

    private Machine getMachine(Long machineId) {
        return machineRepository.findById(machineId)
                .orElseThrow(() -> exceptionUtils.createResourceNotFoundException("Machine", "id", machineId.toString()));
    }

    private void machineExists(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw exceptionUtils.createResourceNotFoundException("Machine", "id", machineId.toString());
        }
    }

    private void checkMachineAvailability(Machine machine, MachineStatus requiredStatus) {
        if (machine.getScheduledStatus() != null && machine.getScheduledStatus() != requiredStatus) {
            throw exceptionUtils.createMachineException(machine.getScheduledStatus().name());
        }
        if (machine.getStatus() != requiredStatus) {
            throw exceptionUtils.createMachineException(machine.getStatus().name(), requiredStatus.name());
        }

        if (!machine.getActive()) {
            throw exceptionUtils.createMachineActivityException();
        }
    }

    private void saveMachineWithOptimisticLock(Machine machine) {
        try {
            machineRepository.save(machine);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw exceptionUtils.createSaveMachineException();
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
