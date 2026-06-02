package com.yuliyuli.admin.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.admin.config.JwtUtil;
import com.yuliyuli.admin.dto.*;
import com.yuliyuli.admin.entity.AdminUser;
import com.yuliyuli.admin.entity.Report;
import com.yuliyuli.admin.repository.AdminUserRepository;
import com.yuliyuli.admin.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminUserRepository adminUserRepository;
    private final ReportRepository reportRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    @Value("${gateway.url}")
    private String gatewayUrl;

    /**
     * Admin JWT login
     */
    public AdminLoginResponse adminLogin(String username, String password) {
        AdminUser admin = adminUserRepository.selectOne(
                new LambdaQueryWrapper<AdminUser>()
                        .eq(AdminUser::getUsername, username)
        );

        if (admin == null) {
            throw new RuntimeException("管理员不存在");
        }

        if (admin.getStatus() != null && admin.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        String token = jwtUtil.generateToken(admin.getId(), admin.getRole());
        AdminUserDTO userDTO = toAdminUserDTO(admin);
        return new AdminLoginResponse(token, userDTO);
    }

    /**
     * List videos for audit via video-service
     */
    public Object getVideoList(Integer page, Integer size, Integer status) {
        String url = gatewayUrl + "/api/video/list?page=" + page + "&size=" + size;
        if (status != null) {
            url += "&status=" + status;
        }

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (body != null && Integer.valueOf(200).equals(body.get("code"))) {
            return body.get("data");
        }
        throw new RuntimeException("获取视频列表失败");
    }

    /**
     * Approve/reject video via video-service
     */
    public void auditVideo(Long videoId, Integer status) {
        String url = gatewayUrl + "/api/video/detail/" + videoId;

        // First verify video exists by fetching it
        try {
            restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
        } catch (Exception e) {
            throw new RuntimeException("视频不存在");
        }

        // For audit, we need a direct DB approach or an audit endpoint in video-service.
        // Since video-service doesn't have an audit endpoint, we update status via RestTemplate
        // calling a hypothetical audit endpoint. For now, we use a simple approach:
        // The admin service manages its own audit state through the report system.
        // Video status update would require video-service to expose an audit API.
        // This is a placeholder that documents the cross-service dependency.
        throw new RuntimeException("视频审核功能需要video-service提供审核API");
    }

    /**
     * List users via user-service
     */
    public Object getUserList(Integer page, Integer size, String keyword) {
        String url = gatewayUrl + "/api/user/list?page=" + page + "&size=" + size;
        if (keyword != null && !keyword.isEmpty()) {
            url += "&keyword=" + keyword;
        }

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body != null && Integer.valueOf(200).equals(body.get("code"))) {
                return body.get("data");
            }
        } catch (Exception e) {
            // user-service may not have /api/user/list endpoint yet
            // Fall back to empty result
        }
        throw new RuntimeException("获取用户列表失败");
    }

    /**
     * Toggle user ban/unban via user-service
     */
    public void toggleUserStatus(Long userId) {
        String url = gatewayUrl + "/api/user/toggle-status";

        try {
            Map<String, Object> body = Map.of("userId", userId);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new org.springframework.http.HttpEntity<>(body),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && Integer.valueOf(200).equals(responseBody.get("code"))) {
                return;
            }
        } catch (Exception e) {
            // user-service may not have toggle-status endpoint yet
        }
        throw new RuntimeException("切换用户状态失败");
    }

    /**
     * List reports
     */
    public Map<String, Object> getReportList(Integer page, Integer size, Integer status) {
        Page<Report> reportPage = new Page<>(page, size);
        LambdaQueryWrapper<Report> wrapper = new LambdaQueryWrapper<>();

        if (status != null) {
            wrapper.eq(Report::getStatus, status);
        }
        wrapper.orderByDesc(Report::getCreatedAt);

        Page<Report> result = reportRepository.selectPage(reportPage, wrapper);

        return Map.of(
                "records", result.getRecords(),
                "total", result.getTotal(),
                "page", page,
                "size", size
        );
    }

    /**
     * Process a report
     */
    public void handleReport(Long reportId, Integer status, Long handlerId, String note) {
        Report report = reportRepository.selectById(reportId);
        if (report == null) {
            throw new RuntimeException("举报不存在");
        }

        if (report.getStatus() != 0) {
            throw new RuntimeException("该举报已处理");
        }

        report.setStatus(status);
        report.setHandlerId(handlerId);
        report.setHandleNote(note != null ? note : "");
        report.setHandledAt(LocalDateTime.now());

        reportRepository.updateById(report);
    }

    private AdminUserDTO toAdminUserDTO(AdminUser admin) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(admin.getId());
        dto.setUsername(admin.getUsername());
        dto.setNickname(admin.getNickname());
        dto.setRole(admin.getRole());
        dto.setStatus(admin.getStatus());
        dto.setCreatedAt(admin.getCreatedAt());
        return dto;
    }
}
