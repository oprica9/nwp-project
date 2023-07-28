package com.raf.rs.nwp.service;

import com.raf.rs.nwp.dto.user.UserCreateDTO;
import com.raf.rs.nwp.dto.user.UserDTO;
import com.raf.rs.nwp.dto.user.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserDTO createUser(UserCreateDTO userCreateDTO);

    Page<UserDTO> getAllUsers(Pageable pageable);

    UserDTO getUserById(Long id);

    UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO);

    void deleteUser(Long id);

}
