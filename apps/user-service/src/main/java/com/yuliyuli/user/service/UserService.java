package com.yuliyuli.user.service;

import cn.hutool.crypto.digest.BCrypt;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.user.config.JwtUtil;
import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.entity.User;
import com.yuliyuli.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

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
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return toDTO(user);
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
