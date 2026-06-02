package com.yuliyuli.follow.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FollowDTO {
    private Long id;
    private Long userId;
    private Long followUserId;
    private LocalDateTime createdAt;
}
