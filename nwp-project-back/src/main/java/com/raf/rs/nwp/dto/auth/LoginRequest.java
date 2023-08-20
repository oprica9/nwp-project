package com.raf.rs.nwp.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class LoginRequest {
    @NotBlank(message = "Email cannot be blank/null")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank/null")
    private String password;
}
