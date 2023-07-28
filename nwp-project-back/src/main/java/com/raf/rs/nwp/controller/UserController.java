package com.raf.rs.nwp.controller;

import com.raf.rs.nwp.dto.api_response.ApiResponse;
import com.raf.rs.nwp.dto.user.UserCreateDTO;
import com.raf.rs.nwp.dto.user.UserDTO;
import com.raf.rs.nwp.dto.user.UserUpdateDTO;
import com.raf.rs.nwp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        UserDTO userDTO = userService.createUser(userCreateDTO);
        ApiResponse<UserDTO> response = new ApiResponse<>(ZonedDateTime.now(), "success", userDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(@RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "10") int size) {
        Page<UserDTO> users = userService.getAllUsers(PageRequest.of(page, size));
        ApiResponse<Page<UserDTO>> response = new ApiResponse<>(ZonedDateTime.now(), "success", users);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        ApiResponse<UserDTO> response = new ApiResponse<>(ZonedDateTime.now(), "success", userDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        UserDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        ApiResponse<UserDTO> response = new ApiResponse<>(ZonedDateTime.now(), "success", updatedUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        ApiResponse<String> response = new ApiResponse<>(ZonedDateTime.now(), "success", "User deleted");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
