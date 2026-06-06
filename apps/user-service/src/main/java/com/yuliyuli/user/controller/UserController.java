package com.yuliyuli.user.controller;

import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 用户登录接口，验证用户名和密码并返回令牌
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "登录成功",
                "data", response
        ));
    }

    /**
     * 用户注册接口，创建新用户账号
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "注册成功",
                "data", ""
        ));
    }

    /**
     * 获取当前登录用户的信息
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("X-User-Id") Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    /**
     * 根据用户ID获取用户信息
     */
    @GetMapping("/info/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfoById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    /**
     * 更新当前用户的个人资料
     */
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

    /**
     * 用户退出登录，将令牌加入黑名单
     */
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

    /**
     * 管理员分页查询用户列表
     */
    @GetMapping("/admin/list")
    public ResponseEntity<Map<String, Object>> adminList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        List<UserDTO> users = userService.adminListUsers(page, size, keyword);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", users
        ));
    }

    /**
     * 管理员切换用户启用/禁用状态
     */
    @PostMapping("/admin/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleStatus(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        userService.toggleUserStatus(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "操作成功",
                "data", ""
        ));
    }
}
