package com.yuliyuli.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuliyuli.user.dto.LoginRequest;
import com.yuliyuli.user.dto.LoginResponse;
import com.yuliyuli.user.dto.RegisterRequest;
import com.yuliyuli.user.dto.UserDTO;
import com.yuliyuli.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void login_shouldReturnToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("test");
        request.setPassword("password");

        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("test");

        LoginResponse response = new LoginResponse("jwt-token", userDTO);
        when(userService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.token").value("jwt-token"));
    }

    @Test
    void register_shouldReturnSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password");
        request.setNickname("New User");

        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
