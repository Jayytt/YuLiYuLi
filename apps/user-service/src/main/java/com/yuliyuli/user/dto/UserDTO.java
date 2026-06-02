package com.yuliyuli.user.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String bio;
    private Integer gender;
    private String birthday;
    private Integer level;
    private Long coin;
    private LocalDateTime createdAt;
}
