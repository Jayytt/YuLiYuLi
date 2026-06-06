package com.yuliyuli.admin.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.admin.config.JwtUtil;
import com.yuliyuli.admin.dto.*;
import com.yuliyuli.admin.entity.AdminUser;
import com.yuliyuli.admin.entity.Report;
import com.yuliyuli.admin.mapper.AdminUserMapper;
import com.yuliyuli.admin.mapper.ReportMapper;
import com.yuliyuli.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminUserMapper adminUserMapper;
    private final ReportMapper reportMapper;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    /**
     * 用户JWT登录认证
     */
    @Override
    public AdminLoginResponse adminLogin(String username, String password) {
        AdminUser admin = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>()
                        .eq(AdminUser::getUsername, username)
        );

        if (admin == null) {
            throw new RuntimeException("管理员不存在");
        }

        if (admin.getStatus() != null && admin.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        if (!BCrypt.checkpw(password, admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        String token = jwtUtil.generateToken(admin.getId(), admin.getRole());
        AdminUserDTO userDTO = toAdminUserDTO(admin);
        return new AdminLoginResponse(token, userDTO);
    }

    /**
     * 通过视频服务获取待审核视频列表
     */
    @Override
    public Object getVideoList(Integer page, Integer size, Integer status) {
        String url = "http://video-service/api/video/admin/list?page=" + page + "&size=" + size;
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
     * 通过视频服务审核视频（通过/拒绝）
     */
    @Override
    public void auditVideo(Long videoId, Integer status) {
        String url = "http://video-service/api/video/admin/audit";

        Map<String, Object> body = Map.of("videoId", videoId, "status", status);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(body),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !Integer.valueOf(200).equals(responseBody.get("code"))) {
            throw new RuntimeException("视频审核失败");
        }
    }

    /**
     * 通过用户服务获取用户列表
     */
    @Override
    public Object getUserList(Integer page, Integer size, String keyword) {
        String url = "http://user-service/api/user/admin/list?page=" + page + "&size=" + size;
        if (keyword != null && !keyword.isEmpty()) {
            url += "&keyword=" + keyword;
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
        throw new RuntimeException("获取用户列表失败");
    }

    /**
     * 通过用户服务切换用户封禁/解封状态
     */
    @Override
    public void toggleUserStatus(Long userId) {
        String url = "http://user-service/api/user/admin/toggle-status";

        Map<String, Object> body = Map.of("userId", userId);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(body),
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !Integer.valueOf(200).equals(responseBody.get("code"))) {
            throw new RuntimeException("切换用户状态失败");
        }
    }

    /**
     * 分页获取举报列表
     */
    @Override
    public Map<String, Object> getReportList(Integer page, Integer size, Integer status) {
        Page<Report> reportPage = new Page<>(page, size);
        LambdaQueryWrapper<Report> wrapper = new LambdaQueryWrapper<>();

        if (status != null) {
            wrapper.eq(Report::getStatus, status);
        }
        wrapper.orderByDesc(Report::getCreatedAt);

        Page<Report> result = reportMapper.selectPage(reportPage, wrapper);

        return Map.of(
                "records", result.getRecords(),
                "total", result.getTotal(),
                "page", page,
                "size", size
        );
    }

    /**
     * 处理举报
     */
    @Override
    public void handleReport(Long reportId, Integer status, Long handlerId, String note) {
        Report report = reportMapper.selectById(reportId);
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

        reportMapper.updateById(report);
    }

    /**
     * 将管理员实体转换为DTO对象
     */
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
