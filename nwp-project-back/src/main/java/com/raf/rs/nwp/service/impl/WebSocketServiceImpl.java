package com.raf.rs.nwp.service.impl;

import com.raf.rs.nwp.dto.machine.MachineDTO;
import com.raf.rs.nwp.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendMessage(String destination, Object data) {
        messagingTemplate.convertAndSend(destination, data);
    }

    @Override
    public void notifyStatusChange(MachineDTO machineDTO) {
        String destination = "/topic/machine-status";
        this.sendMessage(destination, machineDTO);
    }
}
