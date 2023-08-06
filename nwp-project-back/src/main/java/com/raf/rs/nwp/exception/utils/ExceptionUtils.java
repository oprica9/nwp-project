package com.raf.rs.nwp.exception.utils;

import com.raf.rs.nwp.exception.exceptions.MachineException;
import com.raf.rs.nwp.exception.exceptions.ResourceAlreadyExistsException;
import com.raf.rs.nwp.exception.exceptions.ResourceNotFoundException;
import com.raf.rs.nwp.model.enums.MachineStatus;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@AllArgsConstructor
public class ExceptionUtils {

    private final MessageSource messageSource;

    public ResourceNotFoundException createResourceNotFoundException(String resourceType, String fieldName, String fieldValue) {
        String message = messageSource.getMessage("error.resource.notfound", new Object[]{resourceType, fieldName, fieldValue}, Locale.getDefault());
        return new ResourceNotFoundException(message);
    }

    public ResourceAlreadyExistsException createResourceAlreadyExistsException(String resourceType, String fieldName, String fieldValue) {
        String message = messageSource.getMessage("error.resource.already.exists", new Object[]{resourceType, fieldName, fieldValue}, Locale.getDefault());
        return new ResourceAlreadyExistsException(message);
    }

    public MachineException createMachineException(String requestedStatus, String requiredStatus) {
        String message = messageSource.getMessage("error.machine.status", new Object[]{requestedStatus, requiredStatus}, Locale.getDefault());
        return new MachineException(message);
    }

    public MachineException createSaveMachineException() {
        String message = messageSource.getMessage("error.machine.save", new Object[]{}, Locale.getDefault());
        return new MachineException(message);
    }

    public MachineException createMachineException(String scheduledStatus) {
        String message = messageSource.getMessage("error.machine.scheduled.status", new Object[]{scheduledStatus}, Locale.getDefault());
        return new MachineException(message);
    }
    public MachineException createMachineIllegalStateException(MachineStatus state) {
        String message = messageSource.getMessage("error.machine.state", new Object[]{state.name()}, Locale.getDefault());
        return new MachineException(message);
    }
}