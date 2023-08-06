package com.raf.rs.nwp.controller;

import com.raf.rs.nwp.dto.api_response.ApiResponse;
import com.raf.rs.nwp.dto.machine.ErrorMessageDTO;
import com.raf.rs.nwp.dto.machine.MachineCreateDTO;
import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.dto.machine.MachineScheduleDTO;
import com.raf.rs.nwp.dto.search.SearchParamsDTO;
import com.raf.rs.nwp.service.MachineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<MachineDTO>>> searchMachines(@RequestBody SearchParamsDTO params) {
        PageRequest pageRequest = PageRequest.of(params.getPage(), params.getSize());
        Page<MachineDTO> machines = machineService.searchMachines(params.getName(), params.getStatuses(), params.getDateFrom(), params.getDateTo(), pageRequest);
        ApiResponse<Page<MachineDTO>> response = new ApiResponse<>(ZonedDateTime.now(), "success", machines);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<ApiResponse<String>> startMachine(@PathVariable Long id) {
        machineService.startMachine(id);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Starting the machine.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/stop")
    public ResponseEntity<ApiResponse<String>> stopMachine(@PathVariable Long id) {
        machineService.stopMachine(id);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Stopping the machine.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/restart")
    public ResponseEntity<ApiResponse<String>> restartMachine(@PathVariable Long id) {
        machineService.restartMachine(id);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Restarting the machine.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<MachineDTO>> createMachine(@Valid @RequestBody MachineCreateDTO machineCreateDTO,
                                                                 @AuthenticationPrincipal String userEmail) {
        MachineDTO machineDTO = machineService.createMachine(userEmail, machineCreateDTO);
        ApiResponse<MachineDTO> response = new ApiResponse<>(ZonedDateTime.now(), "success", machineDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/destroy")
    public ResponseEntity<ApiResponse<String>> destroyMachine(@PathVariable Long id) {
        machineService.destroyMachine(id);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Machine destroyed");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/schedule-start")
    public ResponseEntity<ApiResponse<String>> scheduleStartMachine(
            @PathVariable Long id,
            @Valid @RequestBody MachineScheduleDTO machineScheduleDTO) {

        LocalDateTime scheduledDateTime = machineScheduleDTO.getScheduledDateTime();
        machineService.scheduleStartMachine(id, scheduledDateTime);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Machine start scheduled.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/schedule-stop")
    public ResponseEntity<ApiResponse<String>> scheduleStopMachine(
            @PathVariable Long id,
            @Valid @RequestBody MachineScheduleDTO machineScheduleDTO) {

        LocalDateTime scheduledDateTime = machineScheduleDTO.getScheduledDateTime();
        machineService.scheduleStopMachine(id, scheduledDateTime);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Machine stop scheduled.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/schedule-restart")
    public ResponseEntity<ApiResponse<String>> scheduleRestartMachine(
            @PathVariable Long id,
            @Valid @RequestBody MachineScheduleDTO machineScheduleDTO) {

        LocalDateTime scheduledDateTime = machineScheduleDTO.getScheduledDateTime();
        machineService.scheduleRestartMachine(id, scheduledDateTime);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "Machine restart scheduled.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<List<String>>> getAllStatuses() {
        List<String> statuses = machineService.getAllStatuses();
        ApiResponse<List<String>> response = new ApiResponse<>(ZonedDateTime.now(), "success", statuses);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/errors")
    public ResponseEntity<ApiResponse<Page<ErrorMessageDTO>>> getAllErrors(@AuthenticationPrincipal String userEmail, @RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ErrorMessageDTO> errorMessages = machineService.getAllErrors(userEmail, pageRequest);
        ApiResponse<Page<ErrorMessageDTO>> response = new ApiResponse<>(ZonedDateTime.now(), "success", errorMessages);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
