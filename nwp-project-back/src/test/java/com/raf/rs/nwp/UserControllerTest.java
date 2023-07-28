package com.raf.rs.nwp;

import com.raf.rs.nwp.controller.UserController;
import com.raf.rs.nwp.dto.user.UserDTO;
import com.raf.rs.nwp.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    // Your other mock beans as needed

    @Test
    @WithMockUser(username = "admin", authorities = {"can_read_users"})
    public void testGetAllUsersWithPagination() throws Exception {
        // Arrange
        List<UserDTO> userDTOs = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            UserDTO userDTO = new UserDTO();
            // Set your userDTO properties here
            userDTOs.add(userDTO);
        }
        Page<UserDTO> pagedUsers = new PageImpl<>(userDTOs);
        when(userService.getAllUsers(any(Pageable.class))).thenReturn(pagedUsers);

        // Act & Assert
        mockMvc.perform(get("/api/users?page=0&size=10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(10)));  // Validate size
    }
}
