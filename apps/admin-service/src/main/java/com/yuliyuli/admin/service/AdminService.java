package com.yuliyuli.admin.service;

import com.yuliyuli.admin.dto.AdminLoginResponse;

import java.util.Map;

public interface AdminService {
    AdminLoginResponse adminLogin(String username, String password);
    Object getVideoList(Integer page, Integer size, Integer status);
    void auditVideo(Long videoId, Integer status);
    Object getUserList(Integer page, Integer size, String keyword);
    void toggleUserStatus(Long userId);
    Map<String, Object> getReportList(Integer page, Integer size, Integer status);
    void handleReport(Long reportId, Integer status, Long handlerId, String note);
}
