package com.raf.rs.nwp.mapper;

import com.raf.rs.nwp.dto.machine.ErrorMessageDTO;
import com.raf.rs.nwp.model.ErrorMessage;
import org.springframework.stereotype.Service;

@Service
public class ErrorMessageMapper {

    public ErrorMessageDTO toDTO(ErrorMessage errorMessage) {
        return new ErrorMessageDTO(errorMessage.getTimestamp(), errorMessage.getMachineId(), errorMessage.getOperation(), errorMessage.getErrorMessage());
    }
}
