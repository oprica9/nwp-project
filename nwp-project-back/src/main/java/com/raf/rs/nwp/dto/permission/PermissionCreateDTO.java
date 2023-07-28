package com.raf.rs.nwp.dto.permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionCreateDTO {

    @NotBlank(message = "Permission name cannot be blank/null")
    @Size(min = 1, max = 100, message = "Permission name must be between 1 and 100 characters")
    private String name;

}
