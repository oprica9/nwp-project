package com.raf.rs.nwp.dto.auth;

import lombok.*;

@RequiredArgsConstructor
@Getter
public class AuthenticationResponseDTO {
    private final String jwt;
}
