package com.raf.rs.nwp.service;

import com.raf.rs.nwp.dto.machine.MachineDTO;

public interface WebSocketService {

    void sendMessage(String destination, Object data);
    void notifyStatusChange(MachineDTO machineDTO);

}
