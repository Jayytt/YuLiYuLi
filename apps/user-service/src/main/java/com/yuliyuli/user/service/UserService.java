package com.yuliyuli.user.service;

import cn.hutool.crypto.digest.BCrypt;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuliyuli.user.config.JwtUtil;
import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.entity.User;
import com.yuliyuli.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";
    private static final String USER_INFO_PREFIX = "user:info:";
    private static final long USER_INFO_TTL_MINUTES = 30;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );

        if (user == null || !BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), "USER");
        UserDTO userDTO = toDTO(user);
        return new LoginResponse(token, userDTO);
    }

    public void register(RegisterRequest request) {
        Long count = userRepository.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );
        if (count > 0) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(BCrypt.hashpw(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setLevel(0);
        user.setCoin(0L);
        userRepository.insert(user);
    }

    public UserDTO getUserById(Long userId) {
        // Check cache first
        String cacheKey = USER_INFO_PREFIX + userId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, UserDTO.class);
            }
        } catch (JsonProcessingException e) {
            // Cache miss, fall through to DB
        }

        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        UserDTO dto = toDTO(user);

        // Populate cache
        try {
            String json = objectMapper.writeValueAsString(dto);
            redisTemplate.opsForValue().set(cacheKey, json, USER_INFO_TTL_MINUTES, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            // Non-critical, skip caching
        }

        return dto;
    }

    public void updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (request.getNickname() != null) user.setNickname(request.getNickname());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getBirthday() != null) user.setBirthday(request.getBirthday());

        userRepository.updateById(user);
        // Invalidate user info cache
        redisTemplate.delete(USER_INFO_PREFIX + userId);
    }

    public void logout(String token) {
        try {
            var claims = jwtUtil.parseToken(token);
            long remainingTtl = claims.getExpiration().getTime() - System.currentTimeMillis();
            if (remainingTtl > 0) {
                redisTemplate.opsForValue().set(
                        TOKEN_BLACKLIST_PREFIX + token, "1", remainingTtl, TimeUnit.MILLISECONDS
                );
            }
        } catch (Exception ignored) {
        }
    }

    public List<UserDTO> adminListUsers(int page, int size, String keyword) {
        Page<User> userPage = new Page<>(page, size);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w
                    .like(User::getUsername, keyword)
                    .or()
                    .like(User::getNickname, keyword)
            );
        }
        wrapper.orderByDesc(User::getCreatedAt);
        Page<User> result = userRepository.selectPage(userPage, wrapper);
        return result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void toggleUserStatus(Long userId) {
        User user = userRepository.selectById(userId);
        if (user != null) {
            // User is active (deleted=0), ban them
            userRepository.updateDeletedById(userId, 1);
        } else {
            // User might be banned (deleted=1), unban them
            int updated = userRepository.updateDeletedById(userId, 0);
            if (updated == 0) {
                throw new RuntimeException("用户不存在");
            }
        }
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setGender(user.getGender());
        dto.setBirthday(user.getBirthday());
        dto.setLevel(user.getLevel());
        dto.setCoin(user.getCoin());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
