package com.yuliyuli.feed.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedDTO {
    private String id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String type;
    private Long videoId;
    private String videoTitle;
    private String videoCover;
    private String content;
    private LocalDateTime createdAt;
}
