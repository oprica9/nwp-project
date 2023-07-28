package com.raf.rs.nwp.dto.user;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank(message = "Email cannot be blank/null")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank/null")
    @Size(min = 4, max = 200, message = "Password must be between 1 and 200 characters")
    private String password;

    @NotBlank(message = "First Name cannot be blank/null")
    @Size(max = 50, message = "First name must be maximum 50 characters")
    private String firstName;

    @NotBlank(message = "Last Name cannot be blank/null")
    @Size(max = 50, message = "Last name must be maximum 50 characters")
    private String lastName;

    private Set<PermissionDTO> permissions;
}