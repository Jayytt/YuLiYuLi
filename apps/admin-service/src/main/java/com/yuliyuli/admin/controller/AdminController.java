package com.yuliyuli.admin.controller;

import com.yuliyuli.admin.dto.*;
import com.yuliyuli.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AdminLoginRequest request) {
        AdminLoginResponse response = adminService.adminLogin(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "登录成功",
                "data", response
        ));
    }

    @GetMapping("/video/list")
    public ResponseEntity<Map<String, Object>> getVideoList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        Object data = adminService.getVideoList(page, size, status);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @PostMapping("/video/audit")
    public ResponseEntity<Map<String, Object>> auditVideo(@RequestBody VideoAuditRequest request) {
        adminService.auditVideo(request.getVideoId(), request.getStatus());
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "审核成功",
                "data", ""
        ));
    }

    @GetMapping("/user/list")
    public ResponseEntity<Map<String, Object>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        Object data = adminService.getUserList(page, size, keyword);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @PostMapping("/user/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@RequestBody UserToggleRequest request) {
        adminService.toggleUserStatus(request.getUserId());
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "操作成功",
                "data", ""
        ));
    }

    @GetMapping("/report/list")
    public ResponseEntity<Map<String, Object>> getReportList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        Map<String, Object> data = adminService.getReportList(page, size, status);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @PostMapping("/report/handle")
    public ResponseEntity<Map<String, Object>> handleReport(@RequestBody ReportHandleRequest request) {
        adminService.handleReport(request.getReportId(), request.getStatus(), request.getHandlerId(), request.getNote());
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "处理成功",
                "data", ""
        ));
    }
}
