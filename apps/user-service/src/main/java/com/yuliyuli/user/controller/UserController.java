package com.yuliyuli.user.controller;

import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "登录成功",
                "data", response
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "注册成功",
                "data", ""
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("X-User-Id") Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfoById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(userId, request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "更新成功",
                "data", ""
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            userService.logout(authorization.substring(7));
        }
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "退出成功",
                "data", ""
        ));
    }
}
