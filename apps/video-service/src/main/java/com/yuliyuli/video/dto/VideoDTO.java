package com.yuliyuli.video.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VideoDTO {
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private String videoUrl;
    private Integer duration;
    private Long viewCount;
    private Long danmakuCount;
    private Long likeCount;
    private Long coinCount;
    private Long favoriteCount;
    private Long shareCount;
    private Long categoryId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private LocalDateTime createdAt;
}
