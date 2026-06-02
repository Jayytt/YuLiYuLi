package com.yuliyuli.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nickname;
    private String avatar;
    private String bio;
    private Integer gender;
    private String birthday;
}
