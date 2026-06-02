package com.yuliyuli.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminLoginResponse {
    private String token;
    private AdminUserDTO user;
}
