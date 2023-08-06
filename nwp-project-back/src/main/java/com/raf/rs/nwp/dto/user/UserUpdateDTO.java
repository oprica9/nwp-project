package com.raf.rs.nwp.dto.user;

import com.raf.rs.nwp.dto.permission.PermissionDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @Email(message = "Email should be valid")
    private String email;

    @Size(min = 1, max = 200, message = "Password must be between 1 and 200 characters")
    private String password;

    @Size(max = 50, message = "First name must be maximum 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be maximum 50 characters")
    private String lastName;

    private Set<PermissionDTO> permissions;
}