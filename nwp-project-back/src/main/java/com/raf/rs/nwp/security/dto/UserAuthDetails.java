package com.raf.rs.nwp.security.dto;

import lombok.*;

import java.util.List;

@RequiredArgsConstructor
@Getter
public class UserAuthDetails {
    private final String email;
    private final String password;
    private final List<String> permissions;
}