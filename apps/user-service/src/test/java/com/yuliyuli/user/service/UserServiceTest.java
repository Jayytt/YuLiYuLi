package com.yuliyuli.user.service;

import com.yuliyuli.user.dto.LoginRequest;
import com.yuliyuli.user.dto.RegisterRequest;
import com.yuliyuli.user.dto.UserDTO;
import com.yuliyuli.user.entity.User;
import com.yuliyuli.user.mapper.UserMapper;
import com.yuliyuli.user.service.impl.UserServiceImpl;
import com.yuliyuli.user.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void register_shouldCreateUser() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setNickname("Test User");

        when(userMapper.selectCount(any())).thenReturn(0L);
        when(userMapper.insert(any(User.class))).thenReturn(1);

        assertDoesNotThrow(() -> userService.register(request));
        verify(userMapper).insert(any(User.class));
    }

    @Test
    void register_shouldThrowWhenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existing");
        request.setPassword("password123");
        request.setNickname("Test");

        when(userMapper.selectCount(any())).thenReturn(1L);

        assertThrows(RuntimeException.class, () -> userService.register(request));
    }

    @Test
    void getUserById_shouldReturnUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("test");
        user.setNickname("Test");
        user.setLevel(0);
        user.setCoin(0L);

        when(userMapper.selectById(1L)).thenReturn(user);

        UserDTO result = userService.getUserById(1L);
        assertEquals("test", result.getUsername());
        assertEquals("Test", result.getNickname());
    }

    @Test
    void getUserById_shouldThrowWhenNotFound() {
        when(userMapper.selectById(999L)).thenReturn(null);
        assertThrows(RuntimeException.class, () -> userService.getUserById(999L));
    }
}
