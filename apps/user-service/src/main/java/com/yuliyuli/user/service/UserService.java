package com.yuliyuli.user.service;

import com.yuliyuli.user.dto.*;

import java.util.List;

public interface UserService {
    LoginResponse login(LoginRequest request);
    void register(RegisterRequest request);
    UserDTO getUserById(Long userId);
    void updateProfile(Long userId, UpdateProfileRequest request);
    void logout(String token);
    List<UserDTO> adminListUsers(int page, int size, String keyword);
    void toggleUserStatus(Long userId);
}
